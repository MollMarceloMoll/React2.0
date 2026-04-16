import React, { useState, useEffect } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import api from '../../api';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    borderBottom: '1 solid #000',
    paddingBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
  },
  value: {
    width: '60%',
    textAlign: 'right',
  },
  table: {
    marginBottom: 10,
    borderTop: '1 solid #000',
    borderBottom: '1 solid #000',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '0.5 solid #999',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    borderBottom: '1 solid #000',
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '25%', textAlign: 'right' },
  total: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    paddingTop: 5,
    borderTop: '1 solid #000',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 9,
    color: '#666',
  },
});

interface ReceiptData {
  venta: any;
  detalles: any[];
}

interface ReceiptProps {
  saleId: number;
  onNewSale: () => void;
}

const ReceiptPDF: React.FC<{ data: ReceiptData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>🐾 PET SHOP - COMPROBANTE</Text>
        <Text>Comprobante de Venta #{data.venta.id}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{data.venta.nombre_cliente}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {new Date(data.venta.fecha).toLocaleString('es-AR')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Método de Pago:</Text>
          <Text style={styles.value}>{data.venta.metodo_pago}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.col1}>Producto</Text>
          <Text style={styles.col2}>Cantidad</Text>
          <Text style={styles.col3}>Precio</Text>
          <Text style={styles.col4}>Subtotal</Text>
        </View>

        {data.detalles.map((detalle, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.col1}>{detalle.nombre}</Text>
            <Text style={styles.col2}>
              {parseFloat(String(detalle.cantidad))} {detalle.tipo_venta === 'kg' ? 'kg' : detalle.tipo_venta === 'bolsa' ? 'bol' : 'unid'}
            </Text>
            <Text style={styles.col3}>${parseFloat(String(detalle.precio_unitario)).toFixed(2)}</Text>
            <Text style={styles.col4}>${parseFloat(String(detalle.subtotal)).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>
            ${data.detalles
              .reduce((sum, d) => sum + parseFloat(String(d.subtotal)), 0)
              .toFixed(2)}
          </Text>
        </View>
        {data.venta.descuento_total > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Descuento:</Text>
            <Text style={styles.value}>-${parseFloat(String(data.venta.descuento_total)).toFixed(2)}</Text>
          </View>
        )}
        <View style={[styles.row, { fontSize: 12, fontWeight: 'bold' }]}>
          <Text style={styles.label}>TOTAL:</Text>
          <Text style={styles.value}>${parseFloat(String(data.venta.total)).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>¡Gracias por su compra!</Text>
        <Text>Conserve este comprobante</Text>
      </View>
    </Page>
  </Document>
);

const Receipt: React.FC<ReceiptProps> = ({ saleId, onNewSale }) => {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReceiptData();
  }, [saleId]);

  const fetchReceiptData = async () => {
    try {
      const response = await api.get(`/ventas/${saleId}`);
      setReceiptData(response.data);
    } catch (err) {
      console.error('Error al obtener comprobante', err);
      setError('Error al cargar el comprobante');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">Cargando comprobante...</p>
      </div>
    );
  }

  if (error || !receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Error al cargar el comprobante'}</p>
          <button
            onClick={onNewSale}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          >
            ➕ Nueva Venta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          ✅ Venta Registrada
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <div className="text-center mb-6">
            <p className="text-gray-600">Número de Venta:</p>
            <p className="text-4xl font-bold text-green-600">{saleId}</p>
          </div>

          <div className="space-y-2 text-gray-800 mb-6">
            <p><span className="font-semibold">Cliente:</span> {receiptData.venta.nombre_cliente}</p>
            <p><span className="font-semibold">Fecha:</span> {new Date(receiptData.venta.fecha).toLocaleString('es-AR')}</p>
            <p><span className="font-semibold">Método de Pago:</span> {receiptData.venta.metodo_pago}</p>
            <p><span className="font-semibold">Total:</span> <span className="text-xl text-green-600 font-bold">${parseFloat(String(receiptData.venta.total)).toFixed(2)}</span></p>
          </div>

          {/* Detalles de los artículos */}
          <div className="mb-6 bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-3">Artículos:</h3>
            <div className="space-y-2">
              {receiptData.detalles.map((detalle, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{detalle.nombre} x {parseFloat(String(detalle.cantidad))}</span>
                  <span>${parseFloat(String(detalle.subtotal)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {receiptData && (
            <PDFDownloadLink
              document={<ReceiptPDF data={receiptData} />}
              fileName={`comprobante_${saleId}.pdf`}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            >
              {({ loading }) => (loading ? 'Generando PDF...' : '📄 Descargar Comprobante PDF')}
            </PDFDownloadLink>
          )}

          <button
            onClick={onNewSale}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          >
            ➕ Nueva Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;