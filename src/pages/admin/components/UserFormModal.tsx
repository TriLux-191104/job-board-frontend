// src/pages/admin/components/UserFormModal.tsx
import { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
import { createUserAPI, updateUserAPI } from "../../../services/users.service";
import { fetchRolesAPI } from "../../../services/roles.service";
import { fetchCompaniesAPI } from "../../../services/companies.service";
import type {
  IUser,
  ICreateUserPayload,
  IUpdateUserPayload,
  IRole,
  ICompany,
} from "../../../types/user.type";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataUpdate?: IUser | null;
}

const UserFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  dataUpdate,
}: UserFormModalProps) => {
  const isUpdateMode = !!dataUpdate;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- STATE LƯU DATA CHO DROPDOWN ---
  const [roles, setRoles] = useState<IRole[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);

  // State form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: 0,
    gender: "MALE",
    address: "",
    roleId: "",
    companyId: "",
    companyName: "",
  });

  // Gọi API lấy Data Dropdown khi mở Modal
  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  const loadDropdownData = async () => {
    try {
      const [resRoles, resCompanies] = await Promise.all([
        fetchRolesAPI(),
        fetchCompaniesAPI(),
      ]);
      if (resRoles.data) setRoles(resRoles.data.result);
      if (resCompanies.data) setCompanies(resCompanies.data.result);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dropdown:", error);
    }
  };

  // Tự động điền dữ liệu nếu là Update Mode
  useEffect(() => {
    if (dataUpdate && isOpen) {
      setFormData({
        name: dataUpdate.name,
        email: dataUpdate.email,
        password: "",
        age: dataUpdate.age,
        gender: dataUpdate.gender,
        address: dataUpdate.address,
        roleId: dataUpdate.role?._id || "",
        companyId: dataUpdate.company?._id || "",
        companyName: dataUpdate.company?.name || "",
      });
    } else if (isOpen && !dataUpdate) {
      // Reset form khi tạo mới
      setFormData({
        name: "",
        email: "",
        password: "",
        age: 0,
        gender: "MALE",
        address: "",
        roleId: "",
        companyId: "",
        companyName: "",
      });
    }
    setError("");
  }, [dataUpdate, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  // Hàm xử lý riêng cho Select Company (Lấy cả ID lẫn Name)
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    // Tìm tên công ty tương ứng với ID vừa chọn
    const selectedCompany = companies.find((c) => c._id === selectedId);

    setFormData((prev) => ({
      ...prev,
      companyId: selectedId,
      companyName: selectedCompany ? selectedCompany.name : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload: ICreateUserPayload | IUpdateUserPayload = {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
        address: formData.address,
        role: formData.roleId,
        company: {
          _id: formData.companyId,
          name: formData.companyName,
        },
      };

      if (isUpdateMode) {
        const updatePayload = {
          ...payload,
          _id: dataUpdate._id,
        } as IUpdateUserPayload;
        await updateUserAPI(updatePayload);
      } else {
        const createPayload = {
          ...payload,
          password: formData.password,
        } as ICreateUserPayload;
        await createUserAPI(createPayload);
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
      title={isUpdateMode ? "Cập nhật Người dùng" : "Thêm mới Người dùng"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên hiển thị
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
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isUpdateMode}
              className="w-full border px-3 py-2 rounded disabled:bg-gray-100"
            />
          </div>
        </div>

        {!isUpdateMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              required={!isUpdateMode}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-1 focus:ring-black"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tuổi
            </label>
            <input
              required
              type="number"
              min="1"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
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

        {/* ĐÃ CHUYỂN ĐỔI THÀNH DROPDOWN (SELECT) XỊN XÒ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò (Role)
            </label>
            <select
              required
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="" disabled>
                -- Chọn vai trò --
              </option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thuộc Công ty
            </label>
            <select
              required
              name="companyId"
              value={formData.companyId}
              onChange={handleCompanyChange}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="" disabled>
                -- Chọn công ty --
              </option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors"
          >
            {isLoading ? "Đang xử lý..." : "Lưu dữ liệu"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
