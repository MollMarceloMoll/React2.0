import React, { useState, useEffect } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setProducts([]);
      }
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">🔍 Buscar Artículos</h2>
      
      <input
        type="text"
        placeholder="Busca por nombre..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-4"
      />

      {loading && <p className="text-gray-500">Buscando...</p>}

      {products.length > 0 && (
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className="p-4 border-b hover:bg-blue-50 cursor-pointer transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{product.nombre}</h3>
                  <p className="text-sm text-gray-500">Categoría: {product.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.precio_venta}</p>
                  <p className="text-xs text-gray-500">
                    {product.categoria === 'alimento' 
                      ? `Stock: ${product.stock_kg}kg` 
                      : `Stock: ${product.stock_unidades} unid.`
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && products.length === 0 && !loading && (
        <p className="text-gray-500 text-center py-4">No se encontraron artículos</p>
      )}

      {selectedProduct && (
        <SaleItemModal
          product={selectedProduct}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={(item) => {
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