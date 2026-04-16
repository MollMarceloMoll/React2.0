import React, { useState } from 'react';
import ClientInfo from './sales/ClientInfo';
import PaymentMethodSelector from './sales/PaymentMethodSelector';
import ProductSearcher from './sales/ProductSearcher';
import SalesCart from './sales/SalesCart';
import Receipt from './sales/Receipt';
import api from '../api';

interface SaleItem {
  producto_id: number;
  nombre: string;
  tipo_venta: 'unidad' | 'bolsa' | 'kg';
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  descuento?: number;
}

const SalesForm: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [descuentoTotal, setDescuentoTotal] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.subtotal, 0) - descuentoTotal;

  const handleAddItem = (item: SaleItem) => {
    setItems([...items, item]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveSale = async () => {
    if (!clientName.trim()) {
      setError('Por favor ingresa el nombre del cliente');
      return;
    }
    if (!paymentMethod) {
      setError('Por favor selecciona un método de pago');
      return;
    }
    if (items.length === 0) {
      setError('Por favor agrega al menos un artículo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token!.split('.')[1]));
      const usuario_id = decoded.id;

      const response = await api.post('/ventas', {
        nombre_cliente: clientName,
        metodo_pago: paymentMethod,
        items: items,
        descuento_total: descuentoTotal,
        total: total,
        usuario_id: usuario_id,
      });

      setLastSaleId(response.data.venta_id);
      setShowReceipt(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar venta');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSale = () => {
    setClientName('');
    setPaymentMethod('');
    setItems([]);
    setDescuentoTotal(0);
    setShowReceipt(false);
    setLastSaleId(null);
    setError(null);
  };

  if (showReceipt && lastSaleId) {
    return (
      <Receipt 
        saleId={lastSaleId} 
        onNewSale={handleNewSale} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-8">
          💳 Formulario de Ventas
        </h1>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 md:p-4 bg-red-600 text-white rounded text-sm md:text-base">
            {error}
          </div>
        )}

        {/* Layout responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Columna izquierda: Info cliente y método pago */}
          <div className="lg:col-span-1 space-y-4">
            <ClientInfo 
              clientName={clientName}
              setClientName={setClientName}
            />
            <PaymentMethodSelector 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* Columna central/derecha: Buscador */}
          <div className="lg:col-span-2">
            <ProductSearcher onAddItem={handleAddItem} />
          </div>
        </div>

        {/* Carrito - Ancho completo */}
        <div>
          <SalesCart 
            items={items}
            descuentoTotal={descuentoTotal}
            setDescuentoTotal={setDescuentoTotal}
            onRemoveItem={handleRemoveItem}
            total={total}
            onSave={handleSaveSale}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesForm;