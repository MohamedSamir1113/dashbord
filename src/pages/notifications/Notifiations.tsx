import React, { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationsService";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-900 dark:border dark:border-gray-700">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        الإشعارات
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          جاري تحميل الإشعارات...
        </p>
      ) : notifications.length > 0 ? (
        <ul className="space-y-3">
          {notifications.map((n: any) => (
            <li
              key={n.id}
              className="border p-3 rounded flex justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {n.text || n.message}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {n.date || n.created_at} - {n.user || n.user_name}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  n.status === "unread"
                    ? "bg-red-100 text-red-600 dark:bg-red-600/20 dark:text-red-400"
                    : "bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400"
                }`}
              >
                {n.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">لا توجد إشعارات</p>
      )}
    </div>
  );
}
