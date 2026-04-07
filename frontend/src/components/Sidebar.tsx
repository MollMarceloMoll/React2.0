import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen, onNuevo }) => {

  const [nuevoOpen, setNuevoOpen] = useState(false); // controla el submenú
  
  return (
    <aside
      className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header del sidebar con botón */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {sidebarOpen ? (
          <span className="text-xl font-bold">Forrajería App</span>
        ) : (
          <span className="text-lg"></span> // ícono visible en modo colapsado
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-700 hover:bg-green-700 text-xs rounded"
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-2 space-y-2">
        <Link to="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-700">
          🏠 {sidebarOpen && <span className="ml-2">Dashboard</span>}
        </Link>

        <Link to="/productos" className="flex items-center p-2 rounded hover:bg-gray-700" title="Lista Mascotas">
          📦 {sidebarOpen && <span className="ml-2">Lista Mascotas</span>}
        </Link>
        
        <Link to="/granja" className="flex items-center p-2 rounded hover:bg-gray-700">
          📦 {sidebarOpen && <span className="ml-2">Lista Granja</span>}
        </Link>

        <Link to="/accesorios" className="flex items-center p-2 rounded hover:bg-gray-700">
          📦 {sidebarOpen && <span className="ml-2">Lista Accesorios</span>}
        </Link>

        {/* Botón Nuevo Artículo */}
        <button
          onClick={() => setNuevoOpen(!nuevoOpen)}
          className="flex items-center w-full p-2 rounded hover:bg-gray-700"
        >
          ➕ {sidebarOpen && <span className="ml-2">Nuevo Artículo</span>}
        </button>

        {/* Submenú desplegable */}
        {nuevoOpen && sidebarOpen && (
          <div className="ml-6 space-y-1">
              <button onClick={() => onNuevo("mascota")} className="block p-2 rounded hover:bg-gray-700">
                🐶 Nuevo Mascota
              </button>
              <button onClick={() => onNuevo("granja")} className="block p-2 rounded hover:bg-gray-700">
                🐔 Nuevo Granja
              </button>
              <button onClick={() => onNuevo("accesorio")} className="block p-2 rounded hover:bg-gray-700">
                🎁 Nuevo Accesorio
              </button>
              <button onClick={() => onNuevo("veterinaria")} className="block p-2 rounded hover:bg-gray-700">
                💉 Nuevo Veterinaria
              </button>
          </div>
        )}

        <Link to="/productos" className="flex items-center p-2 rounded hover:bg-gray-700">
          📦 {sidebarOpen && <span className="ml-2">Lista Veterinaria</span>}
        </Link>
        <Link to="/ventas" className="flex items-center p-2 rounded hover:bg-gray-700">
          💰 {sidebarOpen && <span className="ml-2">Ventas</span>}
        </Link>

        <Link to="/usuarios" className="flex items-center p-2 rounded hover:bg-gray-700">
          👤 {sidebarOpen && <span className="ml-2">Usuarios</span>}
        </Link>

        <Link to="/reportes" className="flex items-center p-2 rounded hover:bg-gray-700">
          📊 {sidebarOpen && <span className="ml-2">Reportes</span>}
        </Link>
        
      </nav>

      {/* Cerrar sesión */}
      <div className="p-2 border-t border-gray-700">
        <button className="w-full p-2 bg-red-600 hover:bg-red-700 rounded">
          🚪 {sidebarOpen && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
