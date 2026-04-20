import React from 'react';
import { CreditCard, Banknote, Building2, Smartphone, Wallet } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const methods = [
  { value: 'efectivo',        label: 'Efectivo',        icon: Banknote   },
  { value: 'transferencia',   label: 'Transferencia',   icon: Building2  },
  { value: 'tarjeta_credito', label: 'Tarjeta Crédito', icon: CreditCard },
  { value: 'tarjeta_debito',  label: 'Tarjeta Débito',  icon: Wallet     },
  { value: 'codigo_qr',       label: 'Código QR',       icon: Smartphone },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-400" />
        Método de Pago
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {methods.map(({ value, label, icon: Icon }) => {
          const isActive = paymentMethod === value;
          return (
            <button
              key={value}
              onClick={() => setPaymentMethod(value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all
                ${isActive
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white'
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;