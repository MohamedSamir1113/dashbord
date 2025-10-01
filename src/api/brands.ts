import axios from "axios";

const API_URL = "/api/v1/admin";
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
};


export const getBrands = async () => {
  const res = await axios.get(`${API_URL}/brands`, { headers });
  return res.data;
};

export const getBrand = async (id: number) => {
  const res = await axios.get(`${API_URL}/brands/${id}`, { headers });
  return res.data;
};

export const createBrand = async (formData: FormData) => {
  const res = await axios.post(`${API_URL}/brands`, formData, {
    headers: { ...headers, "Content-Type": "multipart/form-data" },
  });
  
  return res.data;
};

export const updateBrand = async (id: number, formData: FormData) => {
  
    formData.append("_method", "PUT");
  const res = await axios.post(`${API_URL}/brands/${id}`, formData, {
    headers: { ...headers, "Content-Type": "multipart/form-data" },
  });
  
  return res.data;
};

export const deleteBrand = async (id: number) => {
  const res = await axios.delete(`${API_URL}/brands/${id}`, { headers });
  return res.data;
};