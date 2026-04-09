// src/services/notifications.service.ts
import axiosInstance from "../config/axios.instance";
import type { IBackendRes } from "../types/backend";
import type { INotificationResponse } from "../types/notification.type";

export const fetchNotificationsAPI = async (
  current: number,
  pageSize: number,
): Promise<IBackendRes<INotificationResponse>> => {
  return axiosInstance.get(
    `/notifications?current=${current}&pageSize=${pageSize}&sort=-createdAt`,
  );
};

// Trả về {} hoặc object cụ thể thay vì any
export const markAsReadAPI = async (
  id: string,
): Promise<IBackendRes<Record<string, never>>> => {
  return axiosInstance.patch(`/notifications/${id}/read`);
};
