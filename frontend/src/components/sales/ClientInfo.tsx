import React from 'react';
import { UserCircle } from 'lucide-react';

interface ClientInfoProps {
  clientName: string;
  setClientName: (name: string) => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ clientName, setClientName }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <UserCircle className="w-5 h-5 text-blue-400" />
        Cliente
      </h2>
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
};

export default ClientInfo;