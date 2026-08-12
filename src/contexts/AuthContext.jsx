import axios from "@/utils/apiClient";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateApiOrigin } from "@/utils/apiOrigin";
import {
  clearSession,
  getSession,
  migrateLegacySession,
  subscribeToSessionChanges,
} from "@/utils/token";

const AuthContext = createContext();

const urlFetch = generateApiOrigin("/auth/me");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!getSession()) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await axios.get(urlFetch);
      if (response.status !== 200) {
        throw new Error("Failed to fetch user");
      }
      const data = response.data.user;
      setUser(data);
      return data;
    } catch {
      console.error("Failed to load the authenticated user");
      setUser(null);
      clearSession();
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (migrateLegacySession()) {
      queueMicrotask(() => {
        setUser(null);
        setLoading(false);
      });
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
      return undefined;
    }

    queueMicrotask(fetchUser);

    return subscribeToSessionChanges((session) => {
      if (!session) {
        setUser(null);
        setLoading(false);
      } else {
        fetchUser();
      }
    });
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
