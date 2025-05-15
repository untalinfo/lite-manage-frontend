import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { loginUser as apiLogin } from "../services/authService"; // Asumimos que User se define en authService
import type { User } from "../helpers/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    pass: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Para verificar el estado inicial

  useEffect(() => {
    // Comprobar si hay un usuario en localStorage al cargar la app
    const storedUser = localStorage.getItem("liteManageUser");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("liteManageUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const response = await apiLogin(email, pass); // Llama al servicio mock
    if (response.success && response.user) {
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem("liteManageUser", JSON.stringify(response.user));
      setIsLoading(false);
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, message: response.message || "Login fallido" };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("liteManageUser");
    // Opcional: Redirigir a login si es necesario, se puede manejar en el componente
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
