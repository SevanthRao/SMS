import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides:
 * - user object (with role)
 * - token
 * - login / logout functions
 * - loading state during initial auth check
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, fetch the user profile
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get("/users/me");
          setUser(res.data.data);
        } catch {
          // Token invalid — clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  /**
   * Login: call backend, store token + user in state & localStorage
   */
  const login = async (email, password) => {
    const res = await API.post("/users/login", { email, password });
    const { token: jwt, data } = res.data;

    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(data));
    setToken(jwt);
    setUser(data);

    return data;
  };

  /**
   * Logout: clear everything
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
