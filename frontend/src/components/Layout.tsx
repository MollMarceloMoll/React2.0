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

  const handleNuevo = (tipo: string) => {
    setModalTipo(tipo);
    setModalOpen(true);
  };

  const handleSave = async (data: any) => {

    try {
      const response = await fetch("http://localhost:3000/api/productos", {
        method : "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Error al guardar");
      console.log("Guardado con éxito");
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
          <MascotaForm onSave={handleSave} onCancel={() => setModalOpen(false)} />
        )}
        {/* Granja */}
        {modalTipo === "granja" && (
          <GranjaFrom onSave={handleSave} onCancel={() => setModalOpen(false)} />
        )}
        {/* Accesorio */}
        {modalTipo === "accesorio" && (
          <AccesorioForm onSave={handleSave} onCancel={() => setModalOpen(false)} />
        )}
      </Modal>

      {/* Contenido principal */}
      <main
        className={`flex-1 h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } p-4 overflow-y-auto bg-black text-black`}
      >
        <Outlet />
      </main>
    </div>
  );
}
