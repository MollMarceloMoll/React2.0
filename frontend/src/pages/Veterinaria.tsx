import { useOutletContext } from "react-router-dom";
import { 
  Pencil, 
  Trash2, 
  Package, 
  Warehouse 
} from "lucide-react";

const Veterinaria = () => {
  // 📌 CAMBIO 1: Obtener productos del contexto (no del estado local)
  const { productos, onEditar, cargando, error } = useOutletContext<any>();

  // 📌 CAMBIO 2: Filtrar solo veterinaria
  const veterinaria = productos.filter((p: any) => p.categoria === "veterinaria");

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div className="p-6 bg-slate-900 rounded-2xl shadow-xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-400" />
            Veterinaria
          </h1>
          <p className="text-gray-400 text-sm">
            {veterinaria.length} productos registrados
          </p>
        </div>

        <input
          type="text"
          placeholder="Buscar..."
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* HEAD */}
          <thead>
            <tr className="text-gray-400 border-b border-slate-700 text-left">
              <th className="py-3 px-2">Producto</th>
              <th className="py-3 px-2">Precio</th>
              <th className="py-3 px-2">Stock</th>
              <th className="py-3 px-2">Calidad</th>
              <th className="py-3 px-2">Animal</th>
              <th className="py-3 px-2">Etapa</th>
              <th className="py-3 px-2">Costo</th>
              <th className="py-3 px-2 text-right">Acciones</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {veterinaria.length > 0 ? (
              veterinaria.map((prod: any) => {

                const stock = Number(prod.stock_unidades);

                const stockColor =
                  stock === 0
                    ? "bg-red-500/20 text-red-400"
                    : stock < 5
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400";

                return (
                  <tr
                    key={prod.id}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                  >
                    
                    {/* PRODUCTO */}
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {prod.nombre}
                        </span>
                        <span className="text-xs text-gray-400">
                          #{prod.id}
                        </span>
                      </div>
                    </td>

                    {/* PRECIO */}
                    <td className="py-3 px-2 text-white">
                      ${prod.precio_venta}
                    </td>

                    {/* STOCK */}
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${stockColor}`}>
                        {stock === 0 ? "Sin stock" : `Stock: ${stock}`}
                      </span>
                    </td>

                    {/* ANIMAL */}
                    <td className="py-3 px-2 text-gray-300">
                      {prod.animal}
                    </td>

                    {/* CALIDAD */}
                    <td className="py-3 px-2 text-gray-300">
                      {prod.calidad}
                    </td>

                    {/* ETAPA */}
                    <td className="py-3 px-2 text-gray-300">
                      {prod.etapa || "-"}
                    </td>

                    {/* COSTO */}
                    <td className="py-3 px-2 text-gray-300">
                      ${prod.precio_compra}
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3 px-2">
                      <div className="flex justify-end gap-3">
                        
                        <button
                          onClick={() => onEditar(prod)}
                          className="text-blue-400 hover:text-blue-300 transition"
                          title="Editar producto"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button className="text-red-400 hover:text-red-300 transition" title="Eliminar producto">
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No hay productos cargados.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Veterinaria;