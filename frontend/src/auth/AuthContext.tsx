import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getProfile,
  logoutUser,
  signinUser,
  signupUser,
} from "../api/auth.api";
import { useDispatch } from "react-redux";
import { userApi } from "../pages/user/redux/user.api";
import { cartApi } from "../pages/cart/redux/cart.api";
import { wishlistApi } from "../pages/wishlist/redux/wishlist.api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}

interface RegisterData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  mobile?: string;
  gender?: "M" | "F" | "O";
  birthdate?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const resetAllCaches = useCallback(() => {
    // Group all user-specific APIs
    const userSpecificApis = [
      userApi,
      cartApi,
      wishlistApi,
    ];

    // Reset each one
    userSpecificApis.forEach(api => {
      dispatch(api.util.resetApiState());
    });

    console.log('All user-specific caches reset at:', new Date().toISOString());
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      setUser(null);
      
      // Step 1: Perform login
      const res = await signinUser({ email, password });
      setUser(res.data.user);
      
      // Step 2: Refresh user profile
      await refreshUser();
      
      // Step 3: Now clear caches and let components refetch with proper auth
      // Use setTimeout to ensure this happens after state updates
      setTimeout(() => {
        resetAllCaches();
      }, 0);
      
    } catch (error: any) {
      console.error(error);
      throw new Error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      // Clear caches after logout
      resetAllCaches();
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const res = await signupUser(data);
      setUser(res.data.user);
      // Clear caches after registration
      setTimeout(() => {
        resetAllCaches();
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};