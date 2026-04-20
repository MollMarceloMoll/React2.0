import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import ClientInfo from './sales/ClientInfo';
import PaymentMethodSelector from './sales/PaymentMethodSelector';
import ProductSearcher from './sales/ProductSearcher';
import SalesCart from './sales/SalesCart';
import Receipt from './sales/Receipt';
import api from '../api';

interface SaleItem {
  producto_id:     number;
  nombre:          string;
  tipo_venta:      'unidad' | 'bolsa' | 'kg';
  cantidad:        number;
  precio_unitario: number;
  subtotal:        number;
  descuento?:      number;
}

const SalesForm: React.FC = () => {
  const [clientName,     setClientName]     = useState('');
  const [paymentMethod,  setPaymentMethod]  = useState('');
  const [items,          setItems]          = useState<SaleItem[]>([]);
  const [descuentoTotal, setDescuentoTotal] = useState(0);
  const [showReceipt,    setShowReceipt]    = useState(false);
  const [lastSaleId,     setLastSaleId]     = useState<number | null>(null);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  const subtotalNeto = items.reduce((s, i) => s + i.subtotal, 0);
  const total        = subtotalNeto - subtotalNeto * (descuentoTotal / 100);

  const handleAddItem    = (item: SaleItem) => setItems((prev) => [...prev, item]);
  const handleRemoveItem = (index: number)  => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSaveSale = async () => {
    if (!clientName.trim())   return setError('Por favor ingresá el nombre del cliente');
    if (!paymentMethod)        return setError('Por favor seleccioná un método de pago');
    if (items.length === 0)    return setError('Por favor agregá al menos un artículo');

    setLoading(true);
    setError(null);

    try {
      const token    = localStorage.getItem('token');
      const decoded  = JSON.parse(atob(token!.split('.')[1]));
      const usuario_id = decoded.id;

      const response = await api.post('/ventas', {
        nombre_cliente:  clientName,
        metodo_pago:     paymentMethod,
        items,
        descuento_total: descuentoTotal,
        total,
        usuario_id,
      });

      setLastSaleId(response.data.venta_id);
      setShowReceipt(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar la venta');
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
    return <Receipt saleId={lastSaleId} onNewSale={handleNewSale} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-blue-400" />
          Nueva Venta
        </h1>
        <button
          onClick={handleNewSale}
          className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-300" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-5">

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ── Fila superior: Cliente + Método de pago ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ClientInfo
            clientName={clientName}
            setClientName={setClientName}
          />
          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        {/* ── Buscador de productos ── */}
        <ProductSearcher onAddItem={handleAddItem} />

        {/* ── Carrito ── */}
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
  );
};

export default SalesForm;