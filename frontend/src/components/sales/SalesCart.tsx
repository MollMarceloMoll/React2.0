import React from 'react';
import { ShoppingCart, Trash2, Save } from 'lucide-react';

interface SaleItem {
  producto_id:     number;
  nombre:          string;
  tipo_venta:      string;
  cantidad:        number;
  precio_unitario: number;
  subtotal:        number;
  descuento?:      number;
}

interface SalesCartProps {
  items:              SaleItem[];
  descuentoTotal:     number;          // 0–100 %
  setDescuentoTotal:  (value: number) => void;
  onRemoveItem:       (index: number) => void;
  total:              number;
  onSave:             () => void;
  loading:            boolean;
}

const fmt = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SalesCart: React.FC<SalesCartProps> = ({
  items,
  descuentoTotal,
  setDescuentoTotal,
  onRemoveItem,
  total,
  onSave,
  loading,
}) => {
  const subtotalBruto       = items.reduce((s, i) => s + i.subtotal + (i.descuento || 0), 0);
  const descuentosArticulos = items.reduce((s, i) => s + (i.descuento || 0), 0);
  const subtotalNeto        = items.reduce((s, i) => s + i.subtotal, 0);
  const descuentoGeneralAmt = subtotalNeto * (descuentoTotal / 100); // monto calculado

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      {/* Título */}
      <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-blue-400" />
        Carrito de Compras
      </h2>

      {items.length === 0 ? (
        <p className="text-slate-400 text-center py-10">
          No hay artículos en el carrito
        </p>
      ) : (
        <>
          {/* Tabla */}
          <div className="overflow-x-auto mb-4 rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700/60 text-slate-300 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-center">Cant.</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Desc.</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-600 text-slate-300 text-xs flex items-center justify-center shrink-0">
                        🐾
                      </span>
                      {item.nombre}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-300">
                      {item.cantidad}{' '}
                      {item.tipo_venta === 'kg' ? 'kg' : item.tipo_venta === 'bolsa' ? 'bol' : 'u'}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">
                      ${fmt(item.precio_unitario)}
                    </td>
                    <td className="px-4 py-3 text-right text-orange-400 font-semibold">
                      ${fmt(item.descuento || 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">
                      ${fmt(item.subtotal + (item.descuento || 0))}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-semibold">
                      ${fmt(item.subtotal)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500 border border-red-500/30 hover:border-red-500 flex items-center justify-center mx-auto transition-all group"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Subtotal bruto row */}
                <tr className="border-t border-slate-600 bg-slate-700/30">
                  <td colSpan={2} className="px-4 py-2 text-slate-300 text-sm font-medium">
                    Subtotal bruto:
                  </td>
                  <td className="px-4 py-2 text-right text-slate-300 text-sm">
                    ${fmt(subtotalBruto)}
                  </td>
                  <td />
                  <td />
                  <td className="px-4 py-2 text-right text-white font-semibold text-sm">
                    ${fmt(subtotalBruto)}
                  </td>
                  <td />
                </tr>

                {/* Descuentos artículos row */}
                <tr className="bg-slate-700/20">
                  <td colSpan={5} className="px-4 py-2 text-slate-300 text-sm">
                    Descuentos artículos:
                  </td>
                  <td className="px-4 py-2 text-right text-white font-semibold text-sm">
                    ${fmt(descuentosArticulos)}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Descuento General */}
          <div className="mb-4 p-4 bg-amber-900/20 border border-amber-600/30 rounded-xl">
            <label className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
              🏷️ Descuento General:
            </label>
            <div className="relative mb-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={descuentoTotal}
                onChange={(e) => {
                  const v = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                  setDescuentoTotal(v);
                }}
                className="w-full px-4 py-2.5 pr-10 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                %
              </span>
            </div>
            {/* Presets rápidos */}
            <div className="flex gap-1.5">
              {[0, 5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDescuentoTotal(pct)}
                  className={`flex-1 py-1 rounded text-xs font-medium transition-colors border
                    ${descuentoTotal === pct
                      ? 'bg-amber-500 border-amber-400 text-white'
                      : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            {descuentoTotal > 0 && (
              <p className="text-amber-400 text-xs mt-2">
                Descuento: -${fmt(descuentoGeneralAmt)}
              </p>
            )}
          </div>

          {/* Totales */}
          <div className="space-y-2 mb-5 px-1">
            <div className="flex justify-between text-slate-300 text-sm">
              <span>Subtotal:</span>
              <span className="font-semibold text-white">${fmt(subtotalNeto)}</span>
            </div>
            {descuentoTotal > 0 && (
              <div className="flex justify-between text-orange-400 text-sm">
                <span>Descuento general ({descuentoTotal}%):</span>
                <span className="font-semibold">-${fmt(descuentoGeneralAmt)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-700">
              <span className="text-white font-bold text-lg">TOTAL:</span>
              <span className="text-green-400 font-bold text-2xl">${fmt(total)}</span>
            </div>
          </div>

          {/* Botón guardar */}
          <button
            onClick={onSave}
            disabled={loading}
            className="w-full py-3.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Guardando...' : 'Guardar Venta'}
          </button>
        </>
      )}
    </div>
  );
};

export default SalesCart;