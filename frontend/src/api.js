import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:4000/api", // tu backend Express
  baseURL: "https://react20-production.up.railway.app/api",
});

// Ejemplo de interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");  // ✅ Leer userId
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userId) {
    config.headers["x-user-id"] = userId;  // ✅ Agregar al header
  }
  
  return config;
});

export default api;
