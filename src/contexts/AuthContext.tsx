// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react"; // Thêm type
import type { IAuthUser } from "../types/backend"; // Thêm type
import { getAccountAPI } from "../services/auth.service";
import { STORAGE_KEYS } from "../config/constants";

interface AuthContextType {
  isAuthenticated: boolean;
  user: IAuthUser | null;
  isAppLoading: boolean;
  loginContext: (userData: IAuthUser, token: string) => void;
  logoutContext: () => void;
}

// Bỏ chữ export ở đây để chiều theo luật của Vite Fast Refresh
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  useEffect(() => {
    // Chuyển hàm fetchAccount vào trong useEffect để hết lỗi dependency
    const fetchAccount = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        setIsAppLoading(false);
        return;
      }

      try {
        const res = await getAccountAPI();
        if (res && res.data && res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      } catch {
        // Đã bỏ biến error vì không dùng tới
        handleLogout();
      } finally {
        setIsAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const loginContext = (userData: IAuthUser, token: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAppLoading,
        loginContext,
        logoutContext: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Tạo Custom Hook dùng chung (Sau này ở các page chỉ cần gọi const { user } = useAuth() )
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
