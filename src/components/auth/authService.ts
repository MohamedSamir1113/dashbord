// services/authService.ts
import { api } from "../../pages/services/api";

export const login = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const res = await api.post("/v1/admin/login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
