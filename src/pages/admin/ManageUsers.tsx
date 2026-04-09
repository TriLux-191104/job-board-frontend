// src/pages/admin/ManageUsers.tsx
import { useState } from "react";
import { fetchUsersAPI } from "../../services/users.service";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import UserFormModal from "./components/UserFormModal"; // IMPORT COMPONENT MỚI
import type { IUser } from "../../types/user.type";

const ManageUsers = () => {
  const {
    data: users,
    total,
    isLoading,
    error,
    current,
    pageSize,
    setCurrent,
    refetch,
  } = usePaginatedFetch<IUser>(fetchUsersAPI, 5);

  // --- THÊM STATE ĐIỀU KHIỂN MODAL ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleOpenCreate = () => {
    setSelectedUser(null); // Reset data để báo hiệu là Tạo mới
    setIsModalOpen(true);
  };

  const handleOpenUpdate = (user: IUser) => {
    setSelectedUser(user); // Truyền data để báo hiệu là Cập nhật
    setIsModalOpen(true);
  };
  // ------------------------------------

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Người dùng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số: {total} tài khoản
          </p>
        </div>
        {/* ĐỔI SỰ KIỆN NÚT THÊM MỚI */}
        <button
          onClick={handleOpenCreate}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          + Thêm Mới
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Tên hiển thị</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Giới tính</th>
              <th className="px-4 py-3 font-semibold">Vai trò</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.gender}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {user.role?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    {/* ĐỔI SỰ KIỆN NÚT SỬA */}
                    <button
                      onClick={() => handleOpenUpdate(user)}
                      className="text-blue-600 hover:underline"
                    >
                      Sửa
                    </button>
                    <button className="text-red-600 hover:underline">
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

      {/* RÁP MODAL VÀO CUỐI COMPONENT */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch} // Khi lưu xong tự gọi lại API lấy danh sách mới nhất!
        dataUpdate={selectedUser}
      />
    </div>
  );
};

export default ManageUsers;
