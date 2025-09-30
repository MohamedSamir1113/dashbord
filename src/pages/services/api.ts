import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE;

export const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

// ⬅️ interceptor: يضيف التوكن من localStorage قبل أي request + debug
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    console.log("📌 Token sent to API:", token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found in localStorage");
  }

  console.log("📡 Final Request Config:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });

  return config;
});
