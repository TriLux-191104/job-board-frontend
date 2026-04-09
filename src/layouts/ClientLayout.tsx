import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "../components/shared/NotificationBell"; //

const ClientLayout = () => {
  const { user, logoutContext } = useAuth(); //

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header (Navbar) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/home"
            className="text-xl font-black text-red-600 tracking-tighter flex items-center gap-1"
          >
            <span className="bg-red-600 text-white px-2 py-0.5 rounded italic">
              CLO
            </span>{" "}
            PORTAL
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/home"
              className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
            >
              Trang chủ
            </Link>

            <Link
              to="/my-apps"
              className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
            >
              Lịch sử ứng tuyển
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* --- CHUÔNG THÔNG BÁO CHO NGƯỜI DÙNG --- */}
            <NotificationBell />

            <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>

            <div className="hidden sm:flex flex-col items-start mr-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                Xin chào
              </span>
              <span className="text-sm text-gray-900 font-bold">
                {user?.name || "Khách"}
              </span>
            </div>

            <button
              onClick={logoutContext}
              className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      {/* Footer đơn giản */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-xs font-medium">
          &copy; 2026 Clothing Store. Built with NestJS & ReactJS.
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
