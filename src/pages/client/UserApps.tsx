// src/pages/client/UserApps.tsx
import { useEffect, useState } from "react";

import type { IResume } from "../../types/resume.type";
import { fetchResumeByUserAPI } from "../../services/users.service";

const UserApps = () => {
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchResumeByUserAPI();
        if (res.data) {
          // Backend trả về mảng trực tiếp từ findByUsers
          setResumes(res.data as unknown as IResume[]);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử ứng tuyển:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "REVIEWING":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 font-sans px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Lịch sử ứng tuyển
        </h1>
        <p className="text-gray-500 mt-2">
          Theo dõi trạng thái các hồ sơ bạn đã nộp
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
          <p className="text-gray-400">Bạn chưa nộp hồ sơ ứng tuyển nào.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {resumes.map((res) => (
            <div
              key={res._id}
              className="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {/* Kiểm tra object jobId đã được populate từ Backend chưa */}
                  {typeof res.jobId === "object"
                    ? res.jobId.name
                    : "Vị trí công việc"}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    📅 Ngày nộp:{" "}
                    {new Date(res.createdAt || "").toLocaleDateString()}
                  </span>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${res.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-600 font-medium hover:underline"
                  >
                    Xem CV đã nộp
                  </a>
                </div>
              </div>

              <div className="shrink-0">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(res.status)}`}
                >
                  {res.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserApps;
