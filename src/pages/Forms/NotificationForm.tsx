import { useState } from "react";
import { addNotification } from "../../api/notifications";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotificationForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !body) {
      toast.error("Please fill in both title and body");
      return;
    }

    try {
      setLoading(true);
      await addNotification({ title, body });
      toast.success("Notification sent successfully!");
      setTitle("");
      setBody("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-900">
      <h2 className="text-lg font-bold mb-4">Send Notification</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Notification title"
        className="w-full border p-2 mb-2 rounded"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Notification body"
        className="w-full border p-2 mb-2 rounded"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>

      <ToastContainer style={{ zIndex: 9999 }} />
    </div>
  );
}
