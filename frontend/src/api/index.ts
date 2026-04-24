import axios from "axios";

// 1. Creamos una instacia a Axios con la URL base del backend
const api = axios.create({
    //baseURL: "http://localhost:3000/api",
    baseURL: "https://react20-production.up.railway.app/api",
});

// 2. Interceptor: antes de cada request, agrega el token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. Exportamos la instacia para usarla en los componentes
export default api;