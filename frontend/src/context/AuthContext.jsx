import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("adminUser");

    if (token && savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    if (data.user.role !== "admin") {
      throw new Error("Only admin can login here");
    }

    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));

    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    setToken(data.token);
    setAdmin(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    delete api.defaults.headers.common.Authorization;
    setAdmin(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);