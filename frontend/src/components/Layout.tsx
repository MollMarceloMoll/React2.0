import { useState } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import MascotaForm from "./MascotaForm";
import GranjaFrom from "./GranjaFrom";
import AccesorioForm from "./AccesorioForm";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState("");
  const [productoEditando, setProductoEditando] = useState<any>(null);


  const handleNuevo = (tipo: string) => {
    setProductoEditando(null);
    setModalTipo(tipo);
    setModalOpen(true);
  };

  // Para editar desde la tabla
  const handleEditar = (producto: any) => {
    setProductoEditando(producto); // cargamos los datos del producto a editar
    setModalTipo(producto.categoria); // abre el form correcto segun categoria
    setModalOpen(true);
  }

// handleSave ahora distingue si es POST o PUT
const handleSave = async (data: any) => {
    try {
        const esEdicion = !!data.id;
        const url = esEdicion
            ? `http://localhost:3000/api/productos/${data.id}`
            : "http://localhost:3000/api/productos";
        const method = esEdicion ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al guardar");
        setModalOpen(false);
    } catch (error) {
        console.error(error);
    }
};

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onNuevo={handleNuevo} // Nuevo prop
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
      </Modal>

      {/* Contenido principal */}
      <main
        className={`flex-1 h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } p-4 overflow-y-auto bg-black text-black`}
      >
      <Outlet context={{ onEditar: handleEditar }} />
      </main>
    </div>
  );
}
