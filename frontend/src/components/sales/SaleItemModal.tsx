import React, { useState } from 'react';
import Modal from '../Modal';
import { Package, Minus, Plus, X, ShoppingCart } from 'lucide-react';

const SaleItemModal = ({ product, isOpen, onClose, onAdd }: any) => {
  const [tipo_venta,     setTipo]      = useState('unidad');
  const [cantidad,       setCantidad]  = useState(1);
  const [descuentoPct,   setDescuento] = useState(0);   // 0–100 %
  const [error,          setError]     = useState<string | null>(null);

  const precio        = tipo_venta === 'kg' ? product.precio_venta_kg || 0 : product.precio_venta;
  const subtotal      = cantidad * precio;
  const descuentoAmt  = subtotal * (descuentoPct / 100);   // monto calculado
  const total         = subtotal - descuentoAmt;

  const handleAdd = () => {
    if (cantidad <= 0)               return setError('Cantidad inválida');
    if (descuentoPct < 0 || descuentoPct > 100) return setError('El descuento debe estar entre 0 y 100%');
    onAdd({
      producto_id:     product.id,
      nombre:          product.nombre,
      cantidad,
      precio_unitario: precio,
      subtotal:        total,
      tipo_venta,
      descuento:       descuentoAmt,   // seguimos enviando el monto al carrito
    });
    onClose();
  };

  const adjust = (delta: number) =>
    setCantidad((c) => Math.max(0.1, parseFloat((c + delta).toFixed(2))));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-slate-900 text-white p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            {product.nombre}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Tipo de venta */}
        <div className="mb-5">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
            Tipo de venta
          </label>
          <div className="flex gap-2">
            {['unidad', 'kg'].map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors border
                  ${tipo_venta === t
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad */}
        <div className="mb-5">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
            Cantidad
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjust(-1)}
              className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="flex-1 bg-slate-800 border border-slate-600 text-center py-2 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => adjust(1)}
              className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Precio unitario */}
        <div className="mb-5 flex justify-between items-center text-sm">
          <span className="text-slate-400">Precio unitario</span>
          <span className="text-white font-semibold">${precio.toLocaleString('es-AR')}</span>
        </div>

        {/* Descuento % */}
        <div className="mb-5">
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
            Descuento (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="0"
              value={descuentoPct}
              onChange={(e) => {
                const v = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                setDescuento(v);
              }}
              className="w-full bg-slate-800 border border-slate-600 px-3 py-2 pr-10 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              %
            </span>
          </div>
          {/* Presets rápidos */}
          <div className="flex gap-1.5 mt-2">
            {[0, 5, 10, 15, 20].map((pct) => (
              <button
                key={pct}
                onClick={() => setDescuento(pct)}
                className={`flex-1 py-1 rounded text-xs font-medium transition-colors border
                  ${descuentoPct === pct
                    ? 'bg-amber-500 border-amber-400 text-white'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          {/* Monto calculado */}
          {descuentoPct > 0 && (
            <p className="text-amber-400 text-xs mt-1.5">
              Descuento: -${descuentoAmt.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Total */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-medium">Total</span>
            <span className="text-green-400 text-xl font-bold">
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {descuentoPct > 0 && (
            <p className="text-slate-400 text-xs mt-1 text-right line-through">
              Precio sin desc.: ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SaleItemModal;