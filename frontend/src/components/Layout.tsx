import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import MascotaForm from "./MascotaForm";
import GranjaFrom from "./GranjaFrom";
import AccesorioForm from "./AccesorioForm";
import VeterinariaForm from "./VeterinariaForm";
import { Outlet, useOutletContext } from "react-router-dom";

interface OutletContextType {
  onEditar: (producto: any) => void;
  productos: any[];
  setProductos: (productos: any[]) => void;
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState("");
  const [productoEditando, setProductoEditando] = useState<any>(null);
  
  // 📌 ESTADO PRINCIPAL: Lista de productos
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📌 useEffect: Cargar todos los productos al montar
  useEffect(() => {
    cargarProductos();
  }, []); // Se ejecuta UNA sola vez

  // Función para cargar TODOS los productos
  async function cargarProductos() {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch("https://react20-production.up.railway.app/api");
      if (!response.ok) throw new Error("Error al cargar");
      const datos = await response.json();
      setProductos(datos);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  const handleNuevo = (tipo: string) => {
    setProductoEditando(null);
    setModalTipo(tipo);
    setModalOpen(true);
  };

  // Para editar desde la tabla
  const handleEditar = (producto: any) => {
    setProductoEditando(producto);
    setModalTipo(producto.categoria);
    setModalOpen(true);
  };

  // 🔑 handleSave MEJORADO: Actualiza el estado local
  const handleSave = async (data: any) => {
    try {
      const esEdicion = !!data.id;
      const url = esEdicion
        ? `https://react20-production.up.railway.app/api/${data.id}`
        : "https://react20-production.up.railway.app/api";
      const method = esEdicion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al guardar");
      const resultado = await response.json();

      // 🔑 AQUÍ ESTÁ LA CLAVE: Actualizar el estado local
      if (esEdicion) {
        // Si es edición: actualizar ese item
        setProductos(
          productos.map((prod) =>
            prod.id === data.id ? { ...prod, ...data } : prod
          )
        );
      } else {
        // Si es creación: agregar el nuevo item
        const productoConId = { ...data, id: resultado.id };
        setProductos([...productos, productoConId]);
      }

      setModalOpen(false);
      setProductoEditando(null);
      setError(null);
    } catch (error) {
      setError("Error al guardar producto");
      console.error(error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onNuevo={handleNuevo}
      />

      {/** Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {modalTipo === "mascota" && (
          <MascotaForm
            onSave={handleSave}
            onCancel={() => setModalOpen(false)}
            initialData={productoEditando}
          />
        )}
        {/* Granja */}
        {modalTipo === "granja" && (
          <GranjaFrom
            onSave={handleSave}
            onCancel={() => setModalOpen(false)}
            initialData={productoEditando}
          />
        )}
        {/* Accesorio */}
        {modalTipo === "accesorio" && (
          <AccesorioForm
            onSave={handleSave}
            onCancel={() => setModalOpen(false)}
            initialData={productoEditando}
          />
        )}
        {/* Veterinaria */}
        {modalTipo === "veterinaria" && (
          <VeterinariaForm
            onSave={handleSave}
            onCancel={() => setModalOpen(false)}
            initialData={productoEditando}
          />
        )}
      </Modal>

      {/* Contenido principal */}
      <main
        className={`flex-1 h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } p-4 overflow-y-auto bg-black text-black`}
      >
        {/* 📌 Pasar contexto a los componentes hijos */}
        <Outlet
          context={{
            onEditar: handleEditar,
            productos,
            setProductos,
            cargando,
            error,
          }}
        />
      </main>
    </div>
  );
}