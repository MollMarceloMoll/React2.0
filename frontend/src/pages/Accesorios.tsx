import { useState, useEffect } from "react";
import api from "../api/index";

const Accesorios = () => {
  // 1. Estado para guardar los productos
  const [accesorios, setAccesorios] = useState<any[]>([]);

  // 2. useEffect: se ejecuta al montar el componente
  useEffect(() => {
    const fetchAccesorios = async () => {
      try {
        const res = await api.get("/accesorios"); // llamada al backend
        setAccesorios(res.data); // guardamos los productos en el estado
      } catch (err) {
        console.error("Error al obtener productos", err);
      }
    };

    fetchAccesorios();
  }, []);

  // 3. Renderizamos la tabla
  return (
    <div className="p-6 bg-gray-600 rounded-lg shadow border overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Lista ACCESORIOS</h1>
      <table className="w-full border border-gray-300 border-collapse rounded-lg shadow">
        <thead className="bg-blue-800 font-serif">
          <tr>
            <th className="px-4 py-2 border text-sm">ID</th>
            <th className="px-4 py-2 border text-sm">Nombre</th>
            <th className="px-4 py-2 border text-sm">Precio Unidad</th>
            <th className="px-4 py-2 border text-sm">Precio KG</th>
            <th className="px-4 py-2 border text-sm">Stock</th>
            <th className="px-4 py-2 border text-sm">Categoría</th>
            <th className="px-4 py-2 border text-sm">Calidad</th>
            <th className="px-4 py-2 border text-sm">Animal</th>
            <th className="px-4 py-2 border text-sm">Etapa</th>
            <th className="px-4 py-2 border text-sm">Proteina</th>
            <th className="px-4 py-2 border text-sm">Sabor</th>
            <th className="px-4 py-2 border text-sm">Editar</th>
            <th className="px-4 py-2 border text-sm">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {accesorios.map((prod) => (
            <tr
              key={prod.id}
              className="bg-gray-600 text-white hover:bg-gray-50 hover:text-black transition-colors"
            >
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.id}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.nombre}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">${prod.precio_venta}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">${prod.precio_venta_kg}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.stock_unidades}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.categoria}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.calidad}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.animal}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.etapa}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.proteinas}</td>
              <td className="px-4 py-2 border border-gray-300 text-xs">{prod.sabor}</td>
              <td className="px-4 py-2 border"><button className="cursor-pointer">Editar</button></td>
              <td className="px-4 py-2 border"><button>Delete</button></td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accesorios;
