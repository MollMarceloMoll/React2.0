import React, { useState } from 'react';
import Modal from '../Modal';

interface Product {
  id: number;
  nombre: string;
  precio_venta: number;
  precio_venta_kg?: number;
  peso_bolsa_kg?: number;
  stock_unidades: number;
  stock_kg: number;
  categoria: string;
}

interface SaleItemModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

const SaleItemModal: React.FC<SaleItemModalProps> = ({
  product,
  isOpen,
  onClose,
  onAdd,
}) => {
  const [tipo_venta, setTipo_venta] = useState<'unidad' | 'bolsa' | 'kg'>('unidad');
  const [cantidad, setCantidad] = useState(1);
  const [descuentoItem, setDescuentoItem] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Determinar qué categorías pueden vender por kg
  const puedeVenderPorKg = product.categoria === 'mascota' || product.categoria === 'granja';
  const puedeVenderPorBolsa = product.categoria === 'alimento';

  const precioUnitario = (tipo_venta === 'kg' && product.precio_venta_kg
    ? parseFloat(String(product.precio_venta_kg))
    : parseFloat(String(product.precio_venta))) || 0;

  const subtotalBruto = parseFloat((cantidad * precioUnitario).toFixed(2));
  const subtotal = parseFloat((subtotalBruto - descuentoItem).toFixed(2));

  // Stock disponible según tipo de venta
  const stockDisponible =
    tipo_venta === 'kg' ? product.stock_kg : product.stock_unidades;

  const handleAdd = () => {
    setError(null);

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (cantidad > stockDisponible) {
      setError(`Stock insuficiente. Disponible: ${stockDisponible}`);
      return;
    }

    if (descuentoItem < 0) {
      setError('El descuento no puede ser negativo');
      return;
    }

    if (descuentoItem > subtotalBruto) {
      setError('El descuento no puede ser mayor al total');
      return;
    }

    const item = {
      producto_id: product.id,
      nombre: product.nombre,
      tipo_venta: tipo_venta,
      cantidad,
      precio_unitario: precioUnitario,
      subtotal: subtotal,
      descuento: descuentoItem,
    };

    onAdd(item);
    setCantidad(1);
    setTipo_venta('unidad');
    setDescuentoItem(0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-2xl font-bold mb-4">{product.nombre}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Opciones de venta según categoría */}
          <div>
            <label className="block font-semibold mb-2">Tipo de venta:</label>
            <div className="space-y-2">
              {/* UNIDAD - Todos pueden vender por unidad */}
              <label className="flex items-center">
                <input
                  type="radio"
                  value="unidad"
                  checked={tipo_venta === 'unidad'}
                  onChange={(e) => setTipo_venta(e.target.value as any)}
                  className="mr-2"
                />
                <span>Por unidad</span>
              </label>

              {/* KG - Solo mascota y granja */}
              {puedeVenderPorKg && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="kg"
                    checked={tipo_venta === 'kg'}
                    onChange={(e) => setTipo_venta(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Por kilogramo</span>
                </label>
              )}

              {/* BOLSA - Solo alimento */}
              {puedeVenderPorBolsa && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bolsa"
                    checked={tipo_venta === 'bolsa'}
                    onChange={(e) => setTipo_venta(e.target.value as any)}
                    className="mr-2"
                  />
                  <span>Bolsa completa ({product.peso_bolsa_kg}kg)</span>
                </label>
              )}
            </div>
          </div>

          {/* Stock disponible */}
          <div className="bg-blue-50 p-3 rounded">
            <p className="font-semibold">
              Stock disponible: {stockDisponible} {tipo_venta === 'kg' ? 'kg' : 'unid.'}
            </p>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block font-semibold mb-2">Cantidad:</label>
            <input
              type="number"
              min="0.1"
              step={tipo_venta === 'kg' ? '0.1' : '1'}
              value={cantidad}
              onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              {tipo_venta === 'kg' 
                ? 'Ingresa en kilogramos (ej: 2, 3.5, etc)' 
                : 'Ingresa cantidad de unidades'}
            </p>
          </div>

          {/* Precio unitario */}
          <div className="bg-gray-50 p-3 rounded">
            <p>
              Precio unitario: ${precioUnitario.toFixed(2)} {tipo_venta === 'kg' ? '/kg' : ''}
            </p>
          </div>

          {/* Subtotal bruto */}
          <div className="bg-gray-100 p-3 rounded">
            <p>Subtotal: ${subtotalBruto.toFixed(2)}</p>
          </div>

          {/* Descuento por artículo */}
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <label className="block font-semibold mb-2">Descuento (opcional):</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={descuentoItem}
              onChange={(e) => setDescuentoItem(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">Máximo descuento: ${subtotalBruto.toFixed(2)}</p>
          </div>

          {/* Total Final */}
          <div className="bg-green-100 p-4 rounded border-2 border-green-300">
            <p className="text-2xl font-bold text-green-800">
              Total: ${subtotal.toFixed(2)}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
            >
              ✅ Agregar al carrito
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaleItemModal;