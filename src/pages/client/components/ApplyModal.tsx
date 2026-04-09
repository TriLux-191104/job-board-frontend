// src/pages/client/components/ApplyModal.tsx
import { useState } from "react";
import Modal from "../../../components/common/Modal";
import { useUpload } from "../../../hooks/useUpload";
import { createResumeAPI } from "../../../services/resumes.service";
import type { IJob } from "../../../types/job.type";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDetail: IJob | null;
}

const ApplyModal = ({ isOpen, onClose, jobDetail }: ApplyModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { uploadFile, isUploading } = useUpload();
  const [cvFileName, setCvFileName] = useState("");

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    try {
      const fileName = await uploadFile(file, "resume"); // Lưu vào folder resume
      setCvFileName(fileName);
    } catch {
      setError("Lỗi khi tải CV lên, vui lòng thử lại.");
    }
  };

  const handleApply = async () => {
    if (!cvFileName || !jobDetail) {
      setError("Vui lòng tải lên CV của bạn!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createResumeAPI({
        url: cvFileName,
        companyId: jobDetail.company._id,
        jobId: jobDetail._id,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setCvFileName("");
      }, 2000);
    } catch (err) {
      const errorRes = err as { message?: string };
      setError(errorRes.message || "Nộp CV thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ứng tuyển: ${jobDetail?.name}`}
      maxWidth="max-w-md"
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="text-green-500 text-5xl">✓</div>
          <h3 className="text-xl font-bold">Nộp CV thành công!</h3>
          <p className="text-gray-500">
            Nhà tuyển dụng sẽ sớm liên hệ với bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-6 py-2">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600">Bạn đang ứng tuyển vị trí:</p>
            <p className="font-bold text-gray-900">{jobDetail?.name}</p>
            <p className="text-xs text-gray-500">{jobDetail?.company.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tải lên CV của bạn (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUploadCV}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            {isUploading && (
              <p className="text-xs text-blue-500 mt-2 animate-pulse">
                Đang xử lý file...
              </p>
            )}
            {cvFileName && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                ✓ Đã nhận file: {cvFileName}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button
            onClick={handleApply}
            disabled={isSubmitting || isUploading || !cvFileName}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-300 transition-colors shadow-lg shadow-red-100"
          >
            {isSubmitting ? "Đang nộp..." : "Xác nhận Ứng tuyển"}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ApplyModal;
