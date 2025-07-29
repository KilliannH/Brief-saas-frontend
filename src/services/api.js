import axios from "axios";

const protocol = import.meta.env.VITE_BE_PROTOCOL;
const host = import.meta.env.VITE_BE_HOST;
const port = import.meta.env.VITE_BE_PORT;


const api = axios.create({
  baseURL: `${protocol}://${host}:${port}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;