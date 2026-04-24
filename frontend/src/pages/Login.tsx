/* import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/login", { usuario, contraseña });
            
            // ✅ Guardar datos en localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId.toString());
            localStorage.setItem("usuario", res.data.usuario);
            
            // Redirigir al dashboard
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            // Título arriba 
            <h1 className="text-4xl font-extrabold text-white mb-8">
                Sistema StockControl
            </h1>

            // Formulario 
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Iniciar sesión
                </h2>

                //Mostrar errores
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                />
                
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 mb-4 block">
                    Recordar contraseña
                </a>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold p-3 rounded-lg transition duration-200"
                >
                    {loading ? "Iniciando sesión..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}

export default Login;
*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Enviamos los datos al backend
            const res = await api.post("/login", { usuario, contraseña });
            
            // Debug para ver la estructura exacta en consola
            console.log("Respuesta completa del servidor:", res.data);

            // Extraemos token y user del objeto res.data
            const { token, user } = res.data;

            // ✅ Verificamos que 'user' existe antes de intentar guardar
            if (token && user) {
                localStorage.setItem("token", token);
                localStorage.setItem("userId", user.id.toString());
                localStorage.setItem("usuario", user.usuario);
                localStorage.setItem("role", user.role);

                // Redirigir al dashboard si todo salió bien
                navigate("/dashboard");
            } else {
                throw new Error("La respuesta del servidor no tiene el formato esperado");
            }

        } catch (err: any) {
            console.error("Error capturado en el login:", err);
            
            // Si el backend envió un mensaje de error, lo mostramos; si no, mensaje genérico
            const mensajeError = err.response?.data?.message || "Usuario o contraseña incorrectos";
            setError(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            {/* Título */}
            <h1 className="text-4xl font-extrabold text-white mb-8">
                Sistema StockControl
            </h1>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Iniciar sesión
                </h2>

                {/* Mostrar errores */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        disabled={loading}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        disabled={loading}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required
                    />
                </div>
                
                <div className="my-4 text-right">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                        Recordar contraseña
                    </a>
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold p-3 rounded-lg transition duration-200"
                >
                    {loading ? "Iniciando sesión..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}

export default Login;