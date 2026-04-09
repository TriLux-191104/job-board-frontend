// src/pages/admin/ManageJobs.tsx
import { useState } from "react";
import { fetchJobsAPI, deleteJobAPI } from "../../services/jobs.service";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import JobFormModal from "./components/JobFormModal";
import type { IJob } from "../../types/job.type";

const ManageJobs = () => {
  const {
    data: jobs,
    total,
    isLoading,
    error,
    current,
    pageSize,
    setCurrent,
    refetch,
  } = usePaginatedFetch<IJob>(fetchJobsAPI, 5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);

  const handleOpenCreate = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const handleOpenUpdate = (job: IJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa việc làm này?")) {
      try {
        await deleteJobAPI(id);
        refetch();
      } catch {
        alert("Xóa thất bại!");
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Việc làm</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số: {total} bài đăng
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          + Đăng Job Mới
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Tên Job</th>
              <th className="px-4 py-3 font-semibold">Công ty</th>
              <th className="px-4 py-3 font-semibold">Mức lương</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Chưa có bài đăng nào
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {job.name}
                  </td>
                  <td className="px-4 py-3">{job.company?.name || "N/A"}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    ${job.salary}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {job.isActive ? "Đang tuyển" : "Đã đóng"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => handleOpenUpdate(job)}
                      className="text-blue-600 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            disabled={current === 1}
            onClick={() => setCurrent((prev) => prev - 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm font-medium">
            Trang {current} / {totalPages}
          </span>
          <button
            disabled={current === totalPages}
            onClick={() => setCurrent((prev) => prev + 1)}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        dataUpdate={selectedJob}
      />
    </div>
  );
};

export default ManageJobs;
