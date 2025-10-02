import axios from "axios";

const API_URL = "/api/v1"; 
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
};

export const getNotification = async () => {
  const res = await axios.get(`${API_URL}/notifications/latest`, { headers });
  return res.data.data.notifications || [];
};

export const addNotification = async (data: { title: string; body: string }) => {
  const res = await axios.post(`${API_URL}/notifications/send`, data, { headers });
  return res.data.data.notification;
};
