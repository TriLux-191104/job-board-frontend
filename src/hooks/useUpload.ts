// src/hooks/useUpload.ts
import { useState } from "react";
import axiosInstance from "../config/axios.instance";
import type { IBackendRes } from "../types/backend";

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Tham số folderType quyết định file sẽ lưu vào thư mục nào trên Backend
  const uploadFile = async (
    file: File,
    folderType: string,
  ): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("fileUpload", file);

      // Cấu hình Header chuẩn theo yêu cầu của NestJS Backend
      const res = await axiosInstance.post<
        unknown,
        IBackendRes<{ filename: string }>
      >("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          folder_type: folderType, // Truyền đúng key Backend đang đợi
        },
      });

      if (res && res.data && res.data.filename) {
        return res.data.filename; // Trả về tên file đã lưu
      }
      throw new Error("Không nhận được tên file từ server");
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};
