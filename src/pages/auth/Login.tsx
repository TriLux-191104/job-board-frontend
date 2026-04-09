// src/pages/auth/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { loginAPI } from "../../services/auth.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginContext } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Gọi API từ Service
      const res = await loginAPI(email, password);

      // Theo format interceptor của NestJS: res sẽ có dạng { statusCode, message, data }
      if (res && res.data) {
        const { access_token, user } = res.data;

        // Lưu vào Context & LocalStorage
        loginContext(user, access_token);

        // Điều hướng dựa trên Role
        const roleName = user.role.name;
        if (roleName === "SUPER_ADMIN") {
          navigate("/admin");
        } else if (roleName === "HR") {
          navigate("/hr");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      // Không dùng : any ở trên nữa.
      // Ép kiểu an toàn (Type Assertion) báo cho TS biết error này có thể chứa field 'message'
      const err = error as { message?: string };

      setError(err?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm rounded-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Đăng Nhập</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Hệ thống quản lý tuyển dụng
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              placeholder="admin@gmail.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded border border-red-100">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 text-white font-medium rounded transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 active:bg-red-800"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
