// src/pages/client/JobDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobsAPI } from "../../services/jobs.service";
import ApplyModal from "./components/ApplyModal";
import type { IJob } from "../../types/job.type";
import BookmarkButton from "../../components/shared/BookmarkButton";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        // Tận dụng API fetch list nhưng filter theo ID (hoặc dùng hàm findOne nếu backend có)
        const res = await fetchJobsAPI(1, 1, `_id=${id}`);
        if (res.data && res.data.result.length > 0) {
          setJob(res.data.result[0]);
        }
      } catch {
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse">
        Đang tải chi tiết công việc...
      </div>
    );
  if (!job)
    return (
      <div className="p-10 text-center">Không tìm thấy công việc này.</div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header Detail */}
      <div className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-gray-50 border rounded-xl flex items-center justify-center overflow-hidden">
            <span className="text-3xl font-bold text-gray-300">
              {job.company.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {job.name}
            </h1>
            <p className="text-red-600 font-bold text-xl mt-1">
              $ {job.salary.toLocaleString()}
            </p>
            <p className="text-gray-500 font-medium">
              {job.company.name} • {job.location}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-100 transition-all active:scale-95"
        >
          Ứng tuyển ngay
        </button>
        <BookmarkButton
          jobId={job._id}
          className="w-full md:w-auto justify-center"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b">
              Mô tả công việc
            </h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2">
              Thông tin chung
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mức lương:</span>
                <span className="font-bold">$ {job.salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kinh nghiệm:</span>
                <span className="font-bold">{job.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Số lượng:</span>
                <span className="font-bold">{job.quantity} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hạn nộp:</span>
                <span className="font-bold text-red-500">
                  {new Date(job.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl">
            <h3 className="font-bold mb-4">Kỹ năng</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span
                  key={s._id}
                  className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-600 uppercase border border-gray-200"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobDetail={job}
      />
    </div>
  );
};

export default JobDetail;
