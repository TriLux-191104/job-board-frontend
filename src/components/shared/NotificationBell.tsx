import { useState } from "react";
import { useNotification } from "../../hooks/useNotification"; // Fix import từ hooks
import type { INotification } from "../../types/notification.type";

const NotificationBell = () => {
  const { notifications, unreadCount, markRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2">
        {/* SVG Icon ... */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-80 bg-white border rounded-2xl shadow-2xl z-20 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(
                (
                  notification: INotification, // Định nghĩa Type rõ ràng cho notification
                ) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      markRead(notification._id);
                      setIsOpen(false);
                    }}
                    className={`p-4 border-b cursor-pointer ${!notification.isRead ? "bg-red-50" : "bg-white"}`}
                  >
                    <p className="text-sm font-bold text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.content}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
