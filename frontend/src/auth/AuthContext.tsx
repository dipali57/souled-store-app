import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types";
import {
  checkAuthStatus,
  logoutUser,
  signinUser,
  signupUser,
} from "../api/auth.api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await checkAuthStatus();
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await signinUser({ email, password });
    setUser(response.data.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const response = await signupUser({ username, email, password });
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
