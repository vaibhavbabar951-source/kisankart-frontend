import axios from "axios";

export const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: `${API_ORIGIN}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kk_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// "/uploads/products/x.jpg" -> full URL
export const imgUrl = (path) => (path ? `${API_ORIGIN}${path}` : "");
export const errMsg = (e) => e?.response?.data?.msg || e?.message || "Something went wrong";

export default api;
