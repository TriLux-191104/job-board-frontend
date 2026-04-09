// src/pages/admin/components/CompanyFormModal.tsx
import { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
import {
  createCompanyAPI,
  updateCompanyAPI,
} from "../../../services/companies.service";
import { useUpload } from "../../../hooks/useUpload";
import type {
  ICompany,
  ICreateCompanyPayload,
  IUpdateCompanyPayload,
} from "../../../types/company.type";

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataUpdate?: ICompany | null;
}

const CompanyFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  dataUpdate,
}: CompanyFormModalProps) => {
  const isUpdateMode = !!dataUpdate;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Gọi Hook Upload siêu cấp
  const { uploadFile, isUploading } = useUpload();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    logo: "",
  });

  useEffect(() => {
    if (dataUpdate && isOpen) {
      setFormData({
        name: dataUpdate.name,
        address: dataUpdate.address,
        description: dataUpdate.description,
        logo: dataUpdate.logo,
      });
    } else if (isOpen && !dataUpdate) {
      setFormData({ name: "", address: "", description: "", logo: "" });
    }
    setError("");
  }, [dataUpdate, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- HÀM XỬ LÝ UPLOAD LOGO ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setError("");

    try {
      // Gọi hook, truyền đúng folder_type là 'company'
      const filename = await uploadFile(file, "company");
      setFormData((prev) => ({ ...prev, logo: filename })); // Lưu tên file vào Form
    } catch {
      setError("Lỗi khi tải ảnh lên. Vui lòng thử lại!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logo) {
      setError("Vui lòng upload Logo công ty!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload: ICreateCompanyPayload = { ...formData };

      if (isUpdateMode) {
        const updatePayload: IUpdateCompanyPayload = {
          ...payload,
          _id: dataUpdate._id,
        };
        await updateCompanyAPI(dataUpdate._id, updatePayload);
      } else {
        await createCompanyAPI(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorResponse = err as { message?: string | string[] };
      const msg = Array.isArray(errorResponse?.message)
        ? errorResponse?.message[0]
        : errorResponse?.message;
      setError(msg || "Có lỗi xảy ra khi lưu dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdateMode ? "Cập nhật Công ty" : "Thêm mới Công ty"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên Công ty
          </label>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả chi tiết
          </label>
          <textarea
            required
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Khu vực Upload Ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Công ty
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {isUploading && (
              <span className="text-sm text-blue-500 animate-pulse">
                Đang tải ảnh lên...
              </span>
            )}
            {formData.logo && !isUploading && (
              <span className="text-sm text-green-600 font-medium border border-green-200 bg-green-50 px-2 py-1 rounded">
                Đã tải ảnh: {formData.logo}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Lưu dữ liệu"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyFormModal;
