import { useEffect, useState } from "react";
import { getNotification } from "../../api/notifications";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotification();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>;
  if (notifications.length === 0) return <p className="text-gray-500 dark:text-gray-400">No notifications found.</p>;

  return (
    <ul className="space-y-3">
      {notifications.map((n) => (
        <li
          key={n.id}
          className="border p-3 rounded flex justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">{n.created_at}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
