import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "../components/shared/NotificationBell"; // Import chuông thông báo

const AdminLayout = () => {
  const { user, logoutContext } = useAuth();
  const chatPath = user?.role?.name === "HR" ? "/hr/chat" : "/admin/chat";
  const skillPath = user?.role?.name === "HR" ? "/hr/skills" : "/admin/skills";

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar (Menu dọc) */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 font-bold text-lg border-b border-gray-800">
          <span className="text-red-500 mr-2">C-LEVEL</span> DASHBOARD
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/admin"
            className="block px-4 py-2 rounded bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
          >
            Tổng quan
          </Link>

          <Link
            to="/admin/users"
            className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            Quản lý Users
          </Link>

          <Link
            to="/admin/companies"
            className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            Quản lý Công ty
          </Link>

          <Link
            to="/admin/jobs"
            className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            Quản lý Việc làm
          </Link>

          <Link
            to="/admin/resumes"
            className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            Quản lý CV
          </Link>
          <Link
            to={skillPath}
            className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            Quáº£n lĂ½ Skills
          </Link>
          <Link
            to={chatPath}
            className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            Tin nhắn
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <p className="text-xs text-gray-500 mb-2 truncate">{user?.email}</p>
          <button
            onClick={logoutContext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-bold transition shadow-lg active:scale-95"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            {user?.role?.name === "SUPER_ADMIN"
              ? "Khu vực Quản trị"
              : "Khu vực Tuyển dụng"}
          </h2>

          <div className="flex items-center gap-4">
            {/* --- CHUÔNG THÔNG BÁO CHO ADMIN/HR --- */}
            <NotificationBell />

            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 leading-none">
                {user?.name}
              </span>
              <span className="text-[10px] text-red-600 font-bold uppercase mt-1">
                {user?.role?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Nội dung trang thay đổi ở đây */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
