import { useState, useMemo } from "react";
import { fetchJobsAPI } from "../../services/jobs.service";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { useAuth } from "../../contexts/AuthContext";
import type { IJob } from "../../types/job.type";
import JobCard from "../../components/shared/JobCard";
import SubscribeModal from "./components/SubscribeModal";

const Home = () => {
  const { user } = useAuth();

  // --- State quản lý Modal Đăng ký nhận tin ---
  const [isSubsOpen, setIsSubsOpen] = useState(false);

  // --- State quản lý Search & Filter ---
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("");
  const [filter, setFilter] = useState({ name: "", level: "" });

  // Xây dựng query string gửi lên Backend
  const finalQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.append("isActive", "true");
    if (filter.name) params.append("name", `/${filter.name}/i`);
    if (filter.level) params.append("level", filter.level);
    return params.toString();
  }, [filter]);

  // Hook lấy dữ liệu phân trang
  const {
    data: jobs,
    total,
    isLoading,
    current,
    pageSize,
    setCurrent,
  } = usePaginatedFetch<IJob>(fetchJobsAPI, 12, finalQuery);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrent(1);
    setFilter({ name: searchTerm, level: level });
  };

  return (
    <div className="space-y-10 font-sans pb-10">
      {/* 1. Hero Section & Search Bar */}
      <section className="bg-gray-900 text-white py-16 px-6 rounded-3xl flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight z-10">
          Tìm kiếm công việc <span className="text-red-500">mơ ước</span> của
          bạn
        </h1>
        <p className="text-gray-400 max-w-2xl mb-10 text-lg z-10">
          Hàng ngàn cơ hội nghề nghiệp tại các công ty công nghệ hàng đầu đang
          chờ đón bạn. Bắt đầu sự nghiệp ngay hôm nay.
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white p-2 rounded-2xl flex flex-col lg:flex-row gap-3 shadow-2xl z-10"
        >
          <div className="flex-1 flex items-center px-4 gap-3 border-r border-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Vị trí ứng tuyển, kỹ năng (React, NodeJS...)"
              className="w-full py-3 text-gray-900 outline-none font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lg:w-48 px-4 flex items-center border-r border-gray-100">
            <select
              className="w-full bg-transparent text-gray-700 outline-none cursor-pointer font-medium"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Tất cả cấp bậc</option>
              <option value="INTERN">Intern</option>
              <option value="FRESHER">Fresher</option>
              <option value="JUNIOR">Junior</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Tìm kiếm
          </button>
        </form>
      </section>

      {/* 2. Banner Đăng ký nhận thông báo việc làm */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl text-white">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-black">Việc làm mới nhất!</h3>
            <p className="opacity-90 font-medium text-lg">
              Đăng ký để nhận email thông báo ngay khi có công việc phù hợp với
              kỹ năng của bạn.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsSubsOpen(true)}
          className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap active:scale-95"
        >
          Nhận thông báo
        </button>
      </div>

      {/* 3. Danh sách Việc làm nổi bật */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Việc làm nổi bật
            </h2>
            <p className="text-gray-500 mt-1 italic">
              Khám phá các vị trí đang mở tuyển hấp dẫn nhất
            </p>
          </div>
          <span className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-600 border">
            {total} vị trí
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 animate-pulse rounded-2xl border"
              ></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              Hiện tại không tìm thấy công việc nào phù hợp.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* 4. Phân trang */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button
              disabled={current === 1}
              onClick={() => setCurrent((prev) => prev - 1)}
              className="w-12 h-12 flex items-center justify-center border rounded-2xl disabled:opacity-30 hover:bg-gray-100 transition-all active:scale-90"
            >
              &larr;
            </button>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    current === i + 1
                      ? "bg-white text-red-600 shadow-sm scale-110"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={current === totalPages}
              onClick={() => setCurrent((prev) => prev + 1)}
              className="w-12 h-12 flex items-center justify-center border rounded-2xl disabled:opacity-30 hover:bg-gray-100 transition-all active:scale-90"
            >
              &rarr;
            </button>
          </div>
        )}
      </section>

      {/* Modal đăng ký nhận tin */}
      <SubscribeModal
        isOpen={isSubsOpen}
        onClose={() => setIsSubsOpen(false)}
        userEmail={user?.email || ""}
        userName={user?.name || ""}
      />
    </div>
  );
};

export default Home;
