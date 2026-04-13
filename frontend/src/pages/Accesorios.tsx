import { useOutletContext } from "react-router-dom";

const Accesorios = () => {
  // 📌 CAMBIO 1: Obtener productos del contexto (no del estado local)
  const { productos, onEditar, cargando, error } = useOutletContext<any>();

  // 📌 CAMBIO 2: Filtrar solo accesorios
  const accesorios = productos.filter((p: any) => p.categoria === "accesorio");

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div className="p-6 bg-gray-600 rounded-lg shadow border overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Lista ACCESORIOS ({accesorios.length})</h1>
      <table className="w-full border border-gray-300 border-collapse rounded-lg shadow">
        <thead className="bg-blue-800 font-serif">
          <tr>
            <th className="px-4 py-2 border text-sm">ID</th>
            <th className="px-4 py-2 border text-sm">Nombre</th>
            <th className="px-4 py-2 border text-sm">Precio Unidad</th>
            <th className="px-4 py-2 border text-sm">Stock</th>
            <th className="px-4 py-2 border text-sm">Categoría</th>
            <th className="px-4 py-2 border text-sm">Calidad</th>
            <th className="px-4 py-2 border text-sm">Animal</th>
            <th className="px-4 py-2 border text-sm">Etapa</th>
            <th className="px-4 py-2 border text-sm">Numero</th>
            <th className="px-4 py-2 border text-sm">Color</th>
            <th className="px-4 py-2 border text-sm">Precio Costo</th>
            <th className="px-4 py-2 border text-sm">Editar</th>
            <th className="px-4 py-2 border text-sm">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {accesorios.length > 0 ? (
            accesorios.map((prod: any) => (
              <tr
                key={prod.id}
                className="bg-gray-600 text-white hover:bg-gray-50 hover:text-black transition-colors"
              >
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.id}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.nombre}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">${prod.precio_venta}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.stock_unidades}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.categoria}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.calidad}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.animal}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.etapa}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.talle}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">{prod.color}</td>
                <td className="px-4 py-2 border border-gray-300 text-xs">${prod.precio_compra}</td>
                <td className="px-4 py-2 border">
                  <button 
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    onClick={() => onEditar(prod)}
                  >
                    ✏️ Editar
                  </button>
                </td>
                <td className="px-4 py-2 border">
                  <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={13} className="px-4 py-2 text-center text-white">
                No hay Accesorios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Accesorios;