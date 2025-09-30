import { api } from "./api";

/* ---------------------- Notifications Services ---------------------- */

// Get latest notifications
export const getNotifications = () =>
  api.get(`/v1/notifications/latest`);

// Send notification
export const sendNotification = (payload: { user_id: number; text: string }) =>
  api.post(`/v1/notifications/send`, payload);
