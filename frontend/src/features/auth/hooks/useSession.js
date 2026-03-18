import { useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider";
import { fetchMe } from "../api/authApi";

export function useSession() {
  const { login, logout } = useAuth();

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const response = await fetchMe();
        if (active && response.user) {
          login(response.user);
        }
      } catch (_error) {
        if (active) {
          logout();
        }
      }
    }

    hydrate();

    return () => {
      active = false;
    };
  }, [login, logout]);
}
