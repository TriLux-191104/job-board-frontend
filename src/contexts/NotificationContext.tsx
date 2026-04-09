/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import {
  fetchNotificationsAPI,
  markAsReadAPI,
} from "../services/notifications.service";
import type { INotification } from "../types/notification.type";
import { message } from "antd";

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  markRead: (id: string) => Promise<void>;
}

// Export Context để Hook bên ngoài (useNotification.ts) có thể truy cập
export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  // Dùng useRef cho socket để tránh re-render không cần thiết và lỗi cascading renders
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (isAuthenticated && user) {
      // 1. Fetch dữ liệu thông báo từ Database
      fetchNotificationsAPI(1, 10).then((res) => {
        if (res.data?.result) setNotifications(res.data.result);
      });

      // 2. Thiết lập kết nối Socket thời gian thực
      socketRef.current = io(
        `${import.meta.env.VITE_BACKEND_URL}/notifications`,
        {
          transports: ["websocket"],
          withCredentials: true,
        },
      );

      const socket = socketRef.current;

      socket.on("connect", () => {
        // Tham gia vào phòng riêng của người dùng
        socket.emit("join", `user_${user._id}`);
      });

      // Lắng nghe sự kiện thông báo mới từ Backend
      socket.on("new_notification", (notification: INotification) => {
        setNotifications((prev) => [notification, ...prev]);
        message.info(notification.title);
      });

      return () => {
        socket.close();
        socketRef.current = null;
      };
    }
  }, [isAuthenticated, user]);

  const markRead = async (id: string) => {
    try {
      await markAsReadAPI(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
