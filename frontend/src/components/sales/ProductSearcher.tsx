import React, { useState, useEffect } from 'react';
import { Search, Package } from 'lucide-react';
import api from '../../api';
import SaleItemModal from './SaleItemModal';

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

interface ProductSearcherProps {
  onAddItem: (item: any) => void;
}

const ProductSearcher: React.FC<ProductSearcherProps> = ({ onAddItem }) => {
  const [searchQuery, setSearchQuery]       = useState('');
  const [products, setProducts]             = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal]           = useState(false);
  const [loading, setLoading]               = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) handleSearch();
      else setProducts([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/ventas/search?q=${searchQuery}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error en búsqueda', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-400" />
        Buscar Artículos
      </h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Busca por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {loading && (
        <p className="text-slate-400 text-sm text-center py-2">Buscando...</p>
      )}

      {products.length > 0 && (
        <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-600 divide-y divide-slate-700">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className="flex items-center justify-between p-3 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{product.nombre}</p>
                  <p className="text-slate-400 text-xs">{product.categoria}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-sm">${product.precio_venta}</p>
                <p className="text-slate-400 text-xs">
                  {product.categoria === 'alimento'
                    ? `${product.stock_kg} kg`
                    : `${product.stock_unidades} unid.`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && products.length === 0 && !loading && (
        <p className="text-slate-400 text-sm text-center py-4">
          No se encontraron artículos
        </p>
      )}

      {selectedProduct && (
        <SaleItemModal
          product={selectedProduct}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={(item: any) => {
            onAddItem(item);
            setShowModal(false);
            setSearchQuery('');
            setProducts([]);
          }}
        />
      )}
    </div>
  );
};

export default ProductSearcher;