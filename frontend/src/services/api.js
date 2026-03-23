import axios from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./http-client/token-store";
import { emitAuthSessionUpdated } from "./http-client/auth-events";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (
      status !== 401 ||
      !originalRequest ||
      isAuthEndpoint ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/auth/refresh")
          .then((response) => {
            const payload = response?.data?.data;
            const token = payload?.accessToken;

            if (!token) {
              throw new Error("Missing access token in refresh response");
            }

            setAccessToken(token);
            emitAuthSessionUpdated({
              user: payload.user || null,
              isAuthenticated: true,
            });
            return token;
          })
          .catch((refreshError) => {
            clearAccessToken();
            emitAuthSessionUpdated({ user: null, isAuthenticated: false });
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
