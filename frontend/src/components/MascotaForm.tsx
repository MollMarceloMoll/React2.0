import React, { useState } from "react";

interface MascotaFromProps {
    onSave: (data: any) => void; // funcion que recibe los datos para guardarlos
    onCancel: () => void; // funcion para cerrar el modal sin guardar
}

const MascotaForm: React.FC<MascotaFromProps> = ({ onSave, onCancel }) => {
    // Estado local para cada campo

    const [nombre, setNombre] = useState("");
    const [precio_compra, setPrecio_Compra] = useState("");
    const [precio_venta, setPrecio_Venta] = useState("");
    const [precioKg, setPrecioKg] = useState("");
    const [peso_bolsa_kg, setPeso_Bolsa_Kg] = useState("");
    const [stock_unidades, setStock_Unidades] = useState("");
    const [animal, setAnimal] = useState("");
    const [etapa, setEtapa] = useState("");
    const [proteina, setProteina] = useState("");
    const [sabor, setSabor] = useState("");
    const [calidad, setCalidad] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Creamos el objeto con los datos de mascotas

        const nuevoArticulo = {
            nombre,
            precio_compra,
            precio_venta,
            precio_venta_kg: precioKg,
            peso_bolsa_kg,
            stock_unidades,
            categoria: "mascota",
            animal,
            etapa,
            proteinas: proteina,
            sabor,
            calidad,
        };
        onSave(nuevoArticulo); // Esto dispara el fetch en Layout
    }

    return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
    
    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
      🐾 Nuevo Artículo — Mascotas
    </h2>

    {/* Nombre - fila completa */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
      <input
        type="text"
        placeholder="Ej: Royal Canin Adulto 15kg"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
    </div>

    {/* Grid 2 columnas */}
    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Costo</label>
        <input
          type="number"
          placeholder="0.00"
          value={precio_compra}
          onChange={(e) => setPrecio_Compra(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta</label>
        <input
          type="number"
          placeholder="0.00"
          value={precio_venta}
          onChange={(e) => setPrecio_Venta(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta x Kg</label>
        <input
          type="number"
          placeholder="0.00"
          value={precioKg}
          onChange={(e) => setPrecioKg(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Peso Unidad (kg)</label>
        <input
          type="number"
          placeholder="Ej: 15"
          value={peso_bolsa_kg}
          onChange={(e) => setPeso_Bolsa_Kg(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Unidades</label>
        <input
          type="number"
          placeholder="0"
          value={stock_unidades}
          onChange={(e) => setStock_Unidades(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
        <select
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Seleccionar...</option>
          <option value="perro">🐶 Perro</option>
          <option value="gato">🐱 Gato</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
        <select
          value={etapa}
          onChange={(e) => setEtapa(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Seleccionar...</option>
          <option value="cachorro">Cachorro</option>
          <option value="adulto">Adulto</option>
          <option value="senior">Senior</option>
          <option value="todas">Todas las etapas</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Proteínas %</label>
        <input
          type="number"
          placeholder="Ej: 26"
          value={proteina}
          onChange={(e) => setProteina(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sabor</label>
        <input
          type="text"
          placeholder="Ej: Pollo y arroz"
          value={sabor}
          onChange={(e) => setSabor(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Calidad</label>
        <select
          value={calidad}
          onChange={(e) => setCalidad(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Seleccionar...</option>
          <option value="economica">Económica</option>
          <option value="estandar">Estándar</option>
          <option value="premium">Premium</option>
          <option value="superpremium">Super Premium</option>
        </select>
      </div>

    </div>

    {/* Botones */}
    <div className="flex justify-end gap-2 pt-2 border-t mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
      >
        Guardar
      </button>
    </div>

  </form>
      )
}
export default MascotaForm;