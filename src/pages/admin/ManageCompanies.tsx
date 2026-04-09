// src/pages/admin/ManageCompanies.tsx
import { useState } from "react";
import {
  fetchCompaniesAPI,
  deleteCompanyAPI,
} from "../../services/companies.service";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import CompanyFormModal from "./components/CompanyFormModal";
import type { ICompany } from "../../types/company.type";

const ManageCompanies = () => {
  const {
    data: companies,
    total,
    isLoading,
    error,
    current,
    pageSize,
    setCurrent,
    refetch,
  } = usePaginatedFetch<ICompany>(fetchCompaniesAPI, 5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);

  const handleOpenCreate = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenUpdate = (company: ICompany) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công ty này?")) {
      try {
        await deleteCompanyAPI(id);
        refetch(); // Xóa xong tự động load lại bảng
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Công ty</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng số: {total} đối tác</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          + Thêm Công ty
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Tên Công ty</th>
              <th className="px-4 py-3 font-semibold">Địa chỉ</th>
              <th className="px-4 py-3 font-semibold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-400">
                  Chưa có công ty nào
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-3">
                    {/* Hiển thị Avatar giả để UI đẹp hơn, sau này có ảnh thật sẽ nối link backend */}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                      {company.name.charAt(0)}
                    </div>
                    {company.name}
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    {company.address}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => handleOpenUpdate(company)}
                      className="text-blue-600 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
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

      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        dataUpdate={selectedCompany}
      />
    </div>
  );
};

export default ManageCompanies;
