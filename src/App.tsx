// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCompanies from "./pages/admin/ManageCompanies";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageResumes from "./pages/admin/ManageResumes";
import Home from "./pages/client/Home";
import { NotificationProvider } from "./contexts/NotificationContext";

// 1. IMPORT COMPONENT LOGIN THẬT VÀO ĐÂY
import Login from "./pages/auth/Login";
import JobDetail from "./pages/client/JobDetail";
import UserApps from "./pages/client/UserApps";

// --- XÓA DÒNG NÀY ĐI ---
// const Login = () => <div className="p-10 text-xl font-bold">Trang Đăng Nhập (Login)</div>;

const Unauthorized = () => (
  <div className="p-10 text-xl font-bold text-red-500">
    403 - Bạn không có quyền truy cập trang này!
  </div>
);
const AdminDashboard = () => (
  <div className="p-10 text-xl font-bold text-blue-600">
    Khu vực riêng của SUPER_ADMIN
  </div>
);
const HrDashboard = () => (
  <div className="p-10 text-xl font-bold text-green-600">
    Khu vực riêng của HR
  </div>
);

const App = () => {
  const { isAppLoading } = useAuth();

  if (isAppLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <span className="text-xl font-semibold animate-pulse text-gray-500">
          Đang kiểm tra phiên đăng nhập...
        </span>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Cụm Admin / HR dùng chung AdminLayout */}
          <Route
            element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "HR"]} />}
          >
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/companies" element={<ManageCompanies />} />
              <Route path="/admin/jobs" element={<ManageJobs />} />
              <Route path="/admin/resumes" element={<ManageResumes />} />

              <Route path="/hr" element={<HrDashboard />} />
            </Route>
          </Route>

          {/* Cụm Ứng viên dùng ClientLayout */}
          <Route
            element={<ProtectedRoute allowedRoles={["USER", "NORMAL_USER"]} />}
          >
            <Route element={<ClientLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/job/:id" element={<JobDetail />} />
              <Route path="/my-apps" element={<UserApps />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;
