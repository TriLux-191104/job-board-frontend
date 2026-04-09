// src/types/notification.type.ts

export const NOTIFICATION_TYPE = {
  NEW_JOB: "NEW_JOB",
  RESUME_STATUS: "RESUME_STATUS",
  MESSAGE: "MESSAGE",
  SYSTEM: "SYSTEM",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

// Định nghĩa cấu trúc Metadata cụ thể thay vì any
export interface INotificationMetadata {
  resumeId?: string;
  status?: string;
  jobId?: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: INotificationMetadata; // Sử dụng interface cụ thể
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa cấu trúc trả về từ API phân trang
export interface INotificationResponse {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: INotification[];
}
