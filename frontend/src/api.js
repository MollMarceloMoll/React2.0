import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // tu backend Express
});

// Ejemplo de interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
