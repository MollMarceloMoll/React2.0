import React from "react";

interface ModalProps {
    isOpen: boolean; // controla si el modal esta visible
    onClose: () => void; // funcion para cerrar el modal
    children: React.ReactNode; // contenido dinamico 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {

    if (!isOpen) return null; // si no esta abierto, no renderiza nada
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Contenedor del modal */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              ✖
            </button>

            {/* Contenido dinámico (ej: MascotaForm) */}
            {children}
          </div>
        </div>
    );
};

export default Modal;