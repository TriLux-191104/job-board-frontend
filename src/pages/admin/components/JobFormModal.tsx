// src/pages/admin/components/JobFormModal.tsx
import { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
// Đã import thêm MultiValue từ react-select để sửa lỗi 'any'
import Select from "react-select";
import type { MultiValue } from "react-select";
import { createJobAPI, updateJobAPI } from "../../../services/jobs.service";
import { fetchCompaniesAPI } from "../../../services/companies.service";
import { fetchSkillsAPI } from "../../../services/skills.service";

// ĐÃ SỬA LỖI IMPORT TYPE (Gộp chung IJob, ICreate, IUpdate, ISkill vào 1 dòng type)
import type {
  IJob,
  ICreateJobPayload,
  IUpdateJobPayload,
  ISkill,
} from "../../../types/job.type";
import type { ICompany } from "../../../types/company.type";

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataUpdate?: IJob | null;
}

interface OptionType {
  value: string;
  label: string;
}

const JobFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  dataUpdate,
}: JobFormModalProps) => {
  const isUpdateMode = !!dataUpdate;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<OptionType[]>([]);

  const [formData, setFormData] = useState<ICreateJobPayload>({
    name: "",
    skills: [],
    company: { _id: "", name: "" },
    salary: 0,
    quantity: 1,
    level: "MIDDLE",
    description: "",
    startDate: "",
    endDate: "",
    isActive: true,
    location: "",
  });

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [resCompanies, resSkills] = await Promise.all([
            fetchCompaniesAPI(),
            fetchSkillsAPI(),
          ]);
          if (resCompanies.data) setCompanies(resCompanies.data.result);
          if (resSkills.data) {
            const mappedSkills = resSkills.data.result.map((s: ISkill) => ({
              value: s._id,
              label: s.name,
            }));
            setSkillsOptions(mappedSkills);
          }
        } catch (e) {
          console.error("Lỗi tải dropdown", e);
        }
      };
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (dataUpdate && isOpen) {
      setFormData({
        name: dataUpdate.name,
        skills: dataUpdate.skills.map((s) => s._id),
        company: { _id: dataUpdate.company._id, name: dataUpdate.company.name },
        salary: dataUpdate.salary,
        quantity: dataUpdate.quantity,
        level: dataUpdate.level,
        description: dataUpdate.description,
        startDate: dataUpdate.startDate
          ? dataUpdate.startDate.split("T")[0]
          : "",
        endDate: dataUpdate.endDate ? dataUpdate.endDate.split("T")[0] : "",
        isActive: dataUpdate.isActive,
        location: dataUpdate.location,
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        skills: [],
        company: { _id: "", name: "" },
        salary: 0,
        quantity: 1,
        level: "MIDDLE",
        description: "",
        startDate: "",
        endDate: "",
        isActive: true,
        location: "",
      });
    }
    setError("");
  }, [dataUpdate, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    // ĐÃ SỬA LỖI ANY: Ép kiểu an toàn sang HTMLInputElement để có đủ các thuộc tính
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedCompany = companies.find((c) => c._id === selectedId);
    setFormData((prev) => ({
      ...prev,
      company: {
        _id: selectedId,
        name: selectedCompany ? selectedCompany.name : "",
      },
    }));
  };

  // ĐÃ SỬA LỖI ANY: Dùng MultiValue<OptionType> của react-select
  const handleSkillsChange = (selectedOptions: MultiValue<OptionType>) => {
    const skillIds = selectedOptions
      ? selectedOptions.map((opt) => opt.value)
      : [];
    setFormData((prev) => ({ ...prev, skills: skillIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      setError("Vui lòng chọn ít nhất 1 kỹ năng!");
      return;
    }
    if (!formData.company._id) {
      setError("Vui lòng chọn Công ty!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Tách biệt data để KHÔNG gửi _id vào body
      const {
        name,
        skills,
        salary,
        quantity,
        level,
        description,
        startDate,
        endDate,
        isActive,
        location,
        company,
      } = formData;

      const payload = {
        name,
        skills, // Mảng các string ID của Skill
        salary,
        quantity,
        level,
        description,
        startDate,
        endDate,
        isActive,
        location,
        company: {
          _id: company._id,
          name: company.name,
        },
      };

      if (isUpdateMode && dataUpdate) {
        // Gửi dataUpdate._id làm param, và payload (không chứa _id) làm body
        await updateJobAPI(dataUpdate._id, payload as IUpdateJobPayload);
      } else {
        await createJobAPI(payload as ICreateJobPayload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorResponse = err as { message?: string | string[] };
      const msg = Array.isArray(errorResponse?.message)
        ? errorResponse?.message[0]
        : errorResponse?.message;
      setError(msg || "Có lỗi xảy ra khi lưu Job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdateMode ? "Cập nhật Việc làm" : "Thêm mới Việc làm"}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên công việc
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
            <label className="block text-sm font-medium mb-1">Công ty</label>
            <select
              required
              name="companyId"
              value={formData.company._id}
              onChange={handleCompanyChange}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="" disabled>
                -- Chọn công ty --
              </option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mức lương ($)
            </label>
            <input
              required
              type="number"
              min="0"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số lượng tuyển
            </label>
            <input
              required
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Trình độ (Level)
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="INTERN">Thực tập sinh (Intern)</option>
              <option value="FRESHER">Fresher</option>
              <option value="JUNIOR">Junior</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Kỹ năng yêu cầu (Skills)
          </label>
          <Select
            isMulti
            options={skillsOptions}
            value={skillsOptions.filter((opt) =>
              formData.skills.includes(opt.value),
            )}
            onChange={handleSkillsChange}
            placeholder="Tìm và chọn kỹ năng..."
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Địa điểm làm việc
          </label>
          <input
            required
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mô tả công việc (HTML/Text)
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

        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ngày bắt đầu
            </label>
            <input
              required
              type="date"
              name="startDate"
              value={formData.startDate as string}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Ngày kết thúc
            </label>
            <input
              required
              type="date"
              name="endDate"
              value={formData.endDate as string}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          {/* ĐÃ SỬA LỖI TAILWIND CLASS: Đổi h-[42px] thành h-10.5 */}
          <div className="flex items-center h-10.5 px-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm font-medium text-gray-700">
                Hiển thị (Active)
              </span>
            </label>
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
            disabled={isLoading}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Lưu dữ liệu"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default JobFormModal;
