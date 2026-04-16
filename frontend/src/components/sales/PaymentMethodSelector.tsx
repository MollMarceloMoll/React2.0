import React from 'react';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  const methods = [
    { value: 'efectivo', label: '💵 Efectivo' },
    { value: 'transferencia', label: '🏦 Transferencia' },
    { value: 'tarjeta_credito', label: '💳 Tarjeta Crédito' },
    { value: 'tarjeta_debito', label: '💳 Tarjeta Débito' },
    { value: 'codigo_qr', label: '📱 Código QR' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">💰 Método de Pago</h2>
      <div className="space-y-2">
        {methods.map((method) => (
          <label key={method.value} className="flex items-center">
            <input
              type="radio"
              name="payment"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <span className="text-gray-700">{method.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;