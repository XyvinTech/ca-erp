import { createContext, useContext, useEffect } from "react";
import useAuthStore from "../hooks/useAuthStore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
    role: user?.role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
