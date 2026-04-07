import api from "./index";

// Función para iniciar sesión
export async function login(usuario: string, contraseña: string) {
  const res = await api.post("/login", { usuario, contraseña });
  return res.data; // devuelve el token y cualquier otro dato que mande el backend
}
