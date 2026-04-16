import React from 'react';

interface SaleItem {
  producto_id: number;
  nombre: string;
  tipo_venta: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  descuento?: number;
}

interface SalesCartProps {
  items: SaleItem[];
  descuentoTotal: number;
  setDescuentoTotal: (value: number) => void;
  onRemoveItem: (index: number) => void;
  total: number;
  onSave: () => void;
  loading: boolean;
}

const SalesCart: React.FC<SalesCartProps> = ({
  items,
  descuentoTotal,
  setDescuentoTotal,
  onRemoveItem,
  total,
  onSave,
  loading,
}) => {
  const subtotalBruto = items.reduce((sum, item) => sum + item.subtotal + (item.descuento || 0), 0);

  return (
    <div className="bg-white p-3 md:p-6 rounded-lg shadow">
      <h2 className="text-xl md:text-2xl font-bold mb-4">🛒 Carrito de Compras</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay artículos en el carrito</p>
      ) : (
        <>
          {/* Tabla responsive */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 md:px-4 py-2 text-left">Producto</th>
                  <th className="px-2 md:px-4 py-2 text-center">Cant.</th>
                  <th className="px-2 md:px-4 py-2 text-right">Precio</th>
                  <th className="px-2 md:px-4 py-2 text-right">Desc.</th>
                  <th className="px-2 md:px-4 py-2 text-right">Subtotal</th>
                  <th className="px-2 md:px-4 py-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-2 md:px-4 py-2 text-left max-w-[100px] md:max-w-none truncate">
                      {item.nombre}
                    </td>
                    <td className="px-2 md:px-4 py-2 text-center">
                      <span className="text-xs md:text-sm">
                        {item.cantidad}{' '}
                        {item.tipo_venta === 'kg' ? 'kg' : item.tipo_venta === 'bolsa' ? 'bol' : 'u'}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 text-right text-xs md:text-sm">
                      ${item.precio_unitario.toFixed(2)}
                    </td>
                    <td className="px-2 md:px-4 py-2 text-right text-orange-600 font-semibold text-xs md:text-sm">
                      ${(item.descuento || 0).toFixed(2)}
                    </td>
                    <td className="px-2 md:px-4 py-2 text-right font-semibold text-xs md:text-sm">
                      ${item.subtotal.toFixed(2)}
                    </td>
                    <td className="px-2 md:px-4 py-2 text-center">
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="px-1 md:px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 p-3 md:p-4 rounded border-2 border-gray-300 mb-4 space-y-2 text-sm md:text-base">
            <div className="flex justify-between">
              <span>Subtotal bruto:</span>
              <span className="font-semibold">${subtotalBruto.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-orange-600">
              <span>Descuentos artículos:</span>
              <span className="font-semibold">
                -${items.reduce((sum, item) => sum + (item.descuento || 0), 0).toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-2 flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">${items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Descuento general */}
          <div className="mb-4 p-3 md:p-4 bg-yellow-50 rounded border border-yellow-200">
            <label className="block font-semibold mb-2 text-sm md:text-base">💰 Descuento General:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={descuentoTotal}
              onChange={(e) => setDescuentoTotal(parseFloat(e.target.value) || 0)}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded text-sm md:text-base"
              placeholder="0.00"
            />
          </div>

          {/* Total final */}
          <div className="bg-green-100 p-4 md:p-6 rounded border-2 border-green-300 mb-4">
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span>Subtotal:</span>
              <span className="font-semibold">
                ${items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2 text-orange-600 text-sm md:text-base">
              <span>Descuento:</span>
              <span className="font-semibold">-${descuentoTotal.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg md:text-xl">
              <span className="font-bold">TOTAL:</span>
              <span className="font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botón guardar */}
          <button
            onClick={onSave}
            disabled={loading}
            className="w-full px-4 py-3 md:py-4 bg-green-600 text-white rounded font-bold text-base md:text-lg hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Guardando...' : '✅ Guardar Venta y Generar Comprobante'}
          </button>
        </>
      )}
    </div>
  );
};

export default SalesCart;