// src/pages/admin/ManageResumes.tsx
import {
  fetchResumesAPI,
  updateResumeStatusAPI,
} from "../../services/resumes.service";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import type { IResume, ResumeStatus } from "../../types/resume.type";

const ManageResumes = () => {
  const {
    data: resumes,
    total,
    isLoading,
    error, // Đã sử dụng error
    current, // Đã sử dụng cho UI phân trang
    pageSize,
    setCurrent, // Đã sử dụng cho nút bấm
    refetch,
  } = usePaginatedFetch<IResume>(fetchResumesAPI, 10);

  const handleStatusChange = async (id: string, newStatus: ResumeStatus) => {
    try {
      await updateResumeStatusAPI(id, newStatus);
      await refetch();
    } catch {
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý CV Ứng tuyển
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Nơi HR xét duyệt hồ sơ ứng viên
        </p>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Email Ứng viên</th>
              <th className="px-4 py-3 font-semibold">Vị trí ứng tuyển</th>
              <th className="px-4 py-3 font-semibold">File CV</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : resumes.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Chưa có hồ sơ nào nộp vào
                </td>
              </tr>
            ) : (
              resumes.map((res) => (
                <tr
                  key={res._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{res.email}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {/* Sửa lỗi any bằng cách check kiểu dữ liệu của jobId */}
                    {typeof res.jobId === "object" ? res.jobId.name : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${res.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-600 font-medium hover:underline flex items-center gap-1"
                    >
                      Xem CV (PDF)
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold 
                      ${
                        res.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : res.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={res.status}
                      onChange={(e) =>
                        handleStatusChange(
                          res._id,
                          e.target.value as ResumeStatus,
                        )
                      }
                      className="border rounded px-2 py-1 text-xs bg-white outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWING">REVIEWING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* THÊM PHẦN PHÂN TRANG ĐỂ DÙNG HẾT BIẾN - FIX LỖI UNUSED */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            disabled={current === 1}
            onClick={() => setCurrent((prev) => prev - 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Trước
          </button>
          <span className="text-sm font-medium px-2">
            Trang {current} / {totalPages}
          </span>
          <button
            disabled={current === totalPages}
            onClick={() => setCurrent((prev) => prev + 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageResumes;
