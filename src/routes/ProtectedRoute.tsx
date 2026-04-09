// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  // Nhận vào mảng các Role được phép truy cập (ví dụ: ['SUPER_ADMIN', 'HR'])
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // 1. Nếu chưa đăng nhập -> Đá về trang Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đã đăng nhập nhưng KHÔNG có quyền truy cập Route này -> Đá sang trang báo lỗi
  if (allowedRoles && !allowedRoles.includes(user.role.name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Hợp lệ -> Cho phép đi tiếp vào các Route con bên trong (Outlet)
  return <Outlet />;
};
