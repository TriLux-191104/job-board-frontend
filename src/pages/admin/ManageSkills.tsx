import { useState } from "react";
import {
  deleteSkillAPI,
  fetchSkillsPaginatedAPI,
} from "../../services/skills.service";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import SkillFormModal from "./components/SkillFormModal";
import type { ISkill } from "../../types/skill.type";

const ManageSkills = () => {
  const {
    data: skills,
    total,
    isLoading,
    error,
    current,
    pageSize,
    setCurrent,
    refetch,
  } = usePaginatedFetch<ISkill>(fetchSkillsPaginatedAPI, 8);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);
  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ban co chac muon xoa ky nang nay?")) return;

    try {
      await deleteSkillAPI(id);
      await refetch();
    } catch {
      alert("Khong xoa duoc ky nang");
    }
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quan ly ky nang</h1>
          <p className="mt-1 text-sm text-gray-500">Tong so: {total} ky nang</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedSkill(null);
            setIsModalOpen(true);
          }}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Them ky nang
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Ten</th>
              <th className="px-4 py-3 font-semibold">Mo ta</th>
              <th className="px-4 py-3 text-center font-semibold">Hanh dong</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-400">
                  Dang tai du lieu...
                </td>
              </tr>
            ) : skills.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-400">
                  Chua co ky nang nao
                </td>
              </tr>
            ) : (
              skills.map((skill) => (
                <tr key={skill._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {skill.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {skill.description || "Khong co mo ta"}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSkill(skill);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Sua
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(skill._id)}
                      className="text-red-600 hover:underline"
                    >
                      Xoa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            disabled={current === 1}
            onClick={() => setCurrent((prev) => prev - 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Truoc
          </button>
          <span className="text-sm font-medium">
            Trang {current} / {totalPages}
          </span>
          <button
            disabled={current === totalPages}
            onClick={() => setCurrent((prev) => prev + 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}

      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        dataUpdate={selectedSkill}
      />
    </div>
  );
};

export default ManageSkills;
