import React from 'react';

interface ClientInfoProps {
  clientName: string;
  setClientName: (name: string) => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ clientName, setClientName }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">👤 Cliente</h2>
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default ClientInfo;