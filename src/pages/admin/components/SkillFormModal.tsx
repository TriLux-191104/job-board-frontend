import { useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
import {
  createSkillAPI,
  updateSkillAPI,
} from "../../../services/skills.service";
import type {
  ICreateSkillPayload,
  ISkill,
  IUpdateSkillPayload,
} from "../../../types/skill.type";

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataUpdate?: ISkill | null;
}

const SkillFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  dataUpdate,
}: SkillFormModalProps) => {
  const isUpdateMode = Boolean(dataUpdate);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ICreateSkillPayload>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: dataUpdate?.name || "",
      description: dataUpdate?.description || "",
    });
    setError("");
  }, [dataUpdate, isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isUpdateMode && dataUpdate) {
        const payload: IUpdateSkillPayload = {
          _id: dataUpdate._id,
          ...formData,
        };
        await updateSkillAPI(dataUpdate._id, payload);
      } else {
        await createSkillAPI(formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorResponse = err as { message?: string | string[] };
      const message = Array.isArray(errorResponse.message)
        ? errorResponse.message[0]
        : errorResponse.message;
      setError(message || "Khong luu duoc ky nang");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdateMode ? "Cap nhat ky nang" : "Them ky nang"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Ten ky nang
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mo ta
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2 text-gray-600"
          >
            Huy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Dang luu..." : "Luu"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SkillFormModal;
