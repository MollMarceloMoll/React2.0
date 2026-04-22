import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wheat,
  Gift,
  Syringe,
  PlusCircle,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, onNuevo }) => {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const navigate = useNavigate();

  const menuItem =
    "flex items-center gap-3 p-2 rounded-xl text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition";

  const handleLogout = () => {
    // Limpiar datos de sesión (localStorage, sessionStorage, etc.)
    localStorage.removeItem("token"); // O el nombre que uses para guardar el token
    sessionStorage.clear(); // Limpiar todo el sessionStorage
    
    // Redirigir a la página de login
    navigate("/login");
  };

  return (
    <aside
      className={`bg-slate-900 text-white h-screen fixed top-0 left-0 transition-all duration-300 border-r border-slate-800 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {sidebarOpen && (
          <span className="text-lg font-semibold tracking-wide">
            Forrajería
          </span>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* NAV */}
      <nav className="p-3 space-y-2">

        <Link to="/dashboard" className={menuItem}>
          <LayoutDashboard className="w-5 h-5" />
          {sidebarOpen && "Inicio"}
        </Link>

        <Link to="/productos" className={menuItem}>
          <Package className="w-5 h-5" />
          {sidebarOpen && "Mascotas"}
        </Link>

        <Link to="/granja" className={menuItem}>
          <Wheat className="w-5 h-5" />
          {sidebarOpen && "Granja"}
        </Link>

        <Link to="/accesorios" className={menuItem}>
          <Gift className="w-5 h-5" />
          {sidebarOpen && "Accesorios"}
        </Link>

        <Link to="/veterinaria" className={menuItem}>
          <Syringe className="w-5 h-5" />
          {sidebarOpen && "Veterinaria"}
        </Link>

        {/* NUEVO ARTICULO */}
        <button
          onClick={() => setNuevoOpen(!nuevoOpen)}
          className={`${menuItem} w-full`}
        >
          <PlusCircle className="w-5 h-5 text-blue-400" />
          {sidebarOpen && "Nuevo"}
        </button>

        {/* SUBMENU */}
        {nuevoOpen && sidebarOpen && (
          <div className="ml-8 mt-1 space-y-1 text-sm">

            <button
              onClick={() => onNuevo("mascota")}
              className="block text-gray-400 hover:text-white"
            >
              Mascota
            </button>

            <button
              onClick={() => onNuevo("granja")}
              className="block text-gray-400 hover:text-white"
            >
              Granja
            </button>

            <button
              onClick={() => onNuevo("accesorio")}
              className="block text-gray-400 hover:text-white"
            >
              Accesorio
            </button>

            <button
              onClick={() => onNuevo("veterinaria")}
              className="block text-gray-400 hover:text-white"
            >
              Veterinaria
            </button>

          </div>
        )}

        <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">

          <Link to="/ventas" className={menuItem}>
            <ShoppingCart className="w-5 h-5" />
            {sidebarOpen && "Ventas"}
          </Link>

          <Link to="/usuarios" className={menuItem}>
            <Users className="w-5 h-5" />
            {sidebarOpen && "Usuarios"}
          </Link>

          <Link to="/reportes" className={menuItem}>
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && "Reportes"}
          </Link>

        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 w-full p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
        >
          <LogOut className="w-4 h-4" />
          {sidebarOpen && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;