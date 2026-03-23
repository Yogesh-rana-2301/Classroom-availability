import { api } from "../../../services/api";

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
}

export async function refreshSession() {
  const { data } = await api.post("/auth/refresh");
  return data.data;
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data.data;
}

export async function logout() {
  const { data } = await api.post("/auth/logout", {});
  return data.data;
}
