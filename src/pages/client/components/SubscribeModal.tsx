// src/pages/client/components/SubscribeModal.tsx
import { useState, useEffect } from "react";
import { message } from "antd"; // Fix lỗi "Cannot find name 'message'"
import Modal from "../../../components/common/Modal";
import {
  getSubscriberSkillsAPI,
  updateSubscriberAPI,
} from "../../../services/subscribers.service";
import { fetchSkillsAPI } from "../../../services/skills.service";
import type { ISkill } from "../../../types/job.type";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
}

const SubscribeModal = ({
  isOpen,
  onClose,
  userEmail,
  userName,
}: SubscribeModalProps) => {
  const [allCategories, setAllCategories] = useState<ISkill[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initData = async () => {
        try {
          // 1. Lấy danh mục (đảm bảo fetchSkillsAPI đã được update ở service)
          const resAll = await fetchSkillsAPI();
          if (resAll.data) setAllCategories(resAll.data.result);

          // 2. Lấy danh mục user đã đăng ký
          const resUser = await getSubscriberSkillsAPI();
          if (resUser.data?.skills) {
            setSelectedCategories(resUser.data.skills);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu đăng ký:", error);
        }
      };
      initData();
    }
  }, [isOpen]);

  const handleToggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSubscriberAPI({
        name: userName,
        skills: selectedCategories,
      });
      message.success("Cập nhật đăng ký nhận tin thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật Subscriber:", error); // Fix lỗi "'error' is defined but never used"
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng ký nhận thông báo hàng mới"
    >
      <div className="space-y-6 py-4">
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <p className="text-sm text-red-800">
            Chào <strong>{userName}</strong>, hãy chọn các danh mục bạn quan
            tâm. Chúng tôi sẽ gửi email đến <strong>{userEmail}</strong> khi có
            bộ sưu tập mới!
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Danh mục bạn quan tâm:
          </label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleToggleCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedCategories.includes(cat.name)
                    ? "bg-red-600 text-white border-red-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-red-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Đang lưu..." : "Cập nhật tùy chọn"}
        </button>
      </div>
    </Modal>
  );
};

export default SubscribeModal;
