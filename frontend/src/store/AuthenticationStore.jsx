/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";

const AuthenticationStore = createContext();

export const useAuth = () => {
  const context = useContext(AuthenticationStore);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          setUser(JSON.parse(userStr));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Authentication failed:", e);
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    ["token", "refreshToken", "user"].forEach((key) => localStorage.removeItem(key));
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthenticationStore.Provider
      value={{ user, loading, isAuthenticated, signin, logout, updateUser }}
    >
      {children}
    </AuthenticationStore.Provider>
  );
};
