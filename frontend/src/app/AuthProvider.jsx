import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchMe,
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
} from "../features/auth/api/authApi";
import {
  clearAccessToken,
  setAccessToken,
} from "../services/http-client/token-store";
import { onAuthSessionUpdated } from "../services/http-client/auth-events";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const applySession = useCallback((session) => {
    setAccessToken(session?.accessToken || null);
    setUser(session?.user || null);
  }, []);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const session = await loginRequest(credentials);
      applySession(session);
      return session;
    },
    [applySession],
  );

  const refresh = useCallback(async () => {
    const session = await refreshSession();
    applySession(session);
    return session;
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (_error) {
      // Ignore logout API failures and clear local session regardless.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const session = await refresh();

        // Refresh already returns the latest user, but this ensures parity
        // with backend auth middleware expectations if payload shape evolves.
        if (!session?.user) {
          const me = await fetchMe();
          if (active && me?.user) {
            setUser(me.user);
          }
        }
      } catch (_error) {
        if (active) {
          clearSession();
        }
      } finally {
        if (active) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [clearSession, refresh]);

  useEffect(() => {
    return onAuthSessionUpdated((payload) => {
      if (payload?.isAuthenticated) {
        setUser(payload.user || null);
        return;
      }

      clearSession();
    });
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      refresh,
      setSession: applySession,
      isAuthenticated: Boolean(user),
      isBootstrapping,
    }),
    [applySession, isBootstrapping, login, logout, refresh, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
