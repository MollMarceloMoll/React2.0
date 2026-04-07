import { useState } from "react";
import api from "../api/index";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", { usuario, contraseña});
            localStorage.setItem("token", res.data.token);
            window.location.href = "/dashboard"; // redirige al dashboard
        } catch (err) {
            alert("Usuario o contraseña incorrectos");
        }
    }
    return (
         <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            {/* Título arriba */}
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

                <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <a href="">Recordar contraseña</a>
                
                <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-200"
                >
                Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;
