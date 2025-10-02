import axios from "axios";

const API_URL = "/api/v1/admin";
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
};

export const getProducts = async (page = 1, perPage = 10) => {
  const res = await axios.get(`${API_URL}/products?page=${page}&per_page=${perPage}`, { headers });
  return res.data;
};

export const getProduct = async (page :number) => {
  const res = await axios.get(`${API_URL}/products/${page}`, { headers });
  return res.data;
};

export const deleteProduct=async (productId:number)=>{
const res = await axios.delete(`${API_URL}/products/${productId}`,{headers})
return res.data
}

export const addProduct=async (formData:FormData)=>{
    const res = await axios.post(`${API_URL}/products`,formData,{headers:{...headers,"Content-Type": "multipart/form-data"}})
    return res.data
}

export const updateProduct=async (formData:FormData,productId:number)=>{
  formData.append("_method", "PUT");
    const res = await axios.post(`${API_URL}/products/${productId}`,formData,{headers:{...headers,"Content-Type": "multipart/form-data"}})
    return res.data
}