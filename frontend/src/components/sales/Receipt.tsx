import React, { useState, useEffect } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { CheckCircle, Download, PlusCircle } from 'lucide-react';
import api from '../../api';

/* ─── PDF styles ──────────────────────────────────────────── */
const pdfStyles = StyleSheet.create({
  page:        { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
  header:      { textAlign: 'center', marginBottom: 10, borderBottom: '1 solid #000', paddingBottom: 5 },
  title:       { fontSize: 16, fontWeight: 'bold' },
  section:     { marginBottom: 10 },
  row:         { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label:       { fontWeight: 'bold', width: '40%' },
  value:       { width: '60%', textAlign: 'right' },
  table:       { marginBottom: 10, borderTop: '1 solid #000', borderBottom: '1 solid #000' },
  tableRow:    { display: 'flex', flexDirection: 'row', borderBottom: '0.5 solid #999', paddingBottom: 5, marginBottom: 5 },
  tableHeader: { fontWeight: 'bold', borderBottom: '1 solid #000' },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '25%', textAlign: 'right' },
  total:  { fontSize: 12, fontWeight: 'bold', marginTop: 10, paddingTop: 5, borderTop: '1 solid #000' },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 9, color: '#666' },
});

interface ReceiptData { venta: any; detalles: any[] }
interface ReceiptProps { saleId: number; onNewSale: () => void }

/* ─── PDF Document ────────────────────────────────────────── */
const ReceiptPDF: React.FC<{ data: ReceiptData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>🐾 PET SHOP - COMPROBANTE</Text>
        <Text>Comprobante de Venta #{data.venta.id}</Text>
      </View>

      <View style={pdfStyles.section}>
        {[
          ['Cliente',         data.venta.nombre_cliente],
          ['Fecha',           new Date(data.venta.fecha).toLocaleString('es-AR')],
          ['Método de Pago',  data.venta.metodo_pago],
        ].map(([label, value]) => (
          <View key={label} style={pdfStyles.row}>
            <Text style={pdfStyles.label}>{label}:</Text>
            <Text style={pdfStyles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          <Text style={pdfStyles.col1}>Producto</Text>
          <Text style={pdfStyles.col2}>Cantidad</Text>
          <Text style={pdfStyles.col3}>Precio</Text>
          <Text style={pdfStyles.col4}>Subtotal</Text>
        </View>
        {data.detalles.map((d, i) => (
          <View key={i} style={pdfStyles.tableRow}>
            <Text style={pdfStyles.col1}>{d.nombre}</Text>
            <Text style={pdfStyles.col2}>
              {parseFloat(String(d.cantidad))}{' '}
              {d.tipo_venta === 'kg' ? 'kg' : d.tipo_venta === 'bolsa' ? 'bol' : 'unid'}
            </Text>
            <Text style={pdfStyles.col3}>${parseFloat(String(d.precio_unitario)).toFixed(2)}</Text>
            <Text style={pdfStyles.col4}>${parseFloat(String(d.subtotal)).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={pdfStyles.total}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Subtotal:</Text>
          <Text style={pdfStyles.value}>
            ${data.detalles.reduce((s, d) => s + parseFloat(String(d.subtotal)), 0).toFixed(2)}
          </Text>
        </View>
        {data.venta.descuento_total > 0 && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Descuento:</Text>
            <Text style={pdfStyles.value}>-${parseFloat(String(data.venta.descuento_total)).toFixed(2)}</Text>
          </View>
        )}
        <View style={[pdfStyles.row, { fontSize: 12, fontWeight: 'bold' }]}>
          <Text style={pdfStyles.label}>TOTAL:</Text>
          <Text style={pdfStyles.value}>${parseFloat(String(data.venta.total)).toFixed(2)}</Text>
        </View>
      </View>

      <View style={pdfStyles.footer}>
        <Text>¡Gracias por su compra!</Text>
        <Text>Conserve este comprobante</Text>
      </View>
    </Page>
  </Document>
);

/* ─── Receipt Screen ──────────────────────────────────────── */
const Receipt: React.FC<ReceiptProps> = ({ saleId, onNewSale }) => {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => { fetchReceiptData(); }, [saleId]);

  const fetchReceiptData = async () => {
    try {
      const response = await api.get(`/ventas/${saleId}`);
      setReceiptData(response.data);
    } catch {
      setError('Error al cargar el comprobante');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400 text-lg animate-pulse">Cargando comprobante...</p>
      </div>
    );
  }

  if (error || !receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error || 'Error al cargar el comprobante'}</p>
          <button
            onClick={onNewSale}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors"
          >
            Nueva Venta
          </button>
        </div>
      </div>
    );
  }

  const totalNum = parseFloat(String(receiptData.venta.total));

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex items-start justify-center">
      <div className="w-full max-w-xl">

        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Venta Registrada</h1>
          <p className="text-slate-400 mt-1">Comprobante #{saleId}</p>
        </div>

        {/* Card datos */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-4">
          <div className="space-y-3 mb-6">
            {[
              ['Cliente',        receiptData.venta.nombre_cliente],
              ['Fecha',          new Date(receiptData.venta.fecha).toLocaleString('es-AR')],
              ['Método de Pago', receiptData.venta.metodo_pago],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Artículos */}
          <div className="bg-slate-700/40 rounded-xl p-4 mb-6">
            <h3 className="text-slate-300 font-semibold text-sm mb-3">Artículos</h3>
            <div className="space-y-2">
              {receiptData.detalles.map((d, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-300">
                    {d.nombre} × {parseFloat(String(d.cantidad))}
                  </span>
                  <span className="text-white">${parseFloat(String(d.subtotal)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-slate-700 pt-4">
            <span className="text-white font-bold text-lg">TOTAL</span>
            <span className="text-green-400 font-bold text-3xl">${totalNum.toFixed(2)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <PDFDownloadLink
            document={<ReceiptPDF data={receiptData} />}
            fileName={`comprobante_${saleId}.pdf`}
            className="flex-1"
          >
            {({ loading: pdfLoading }) => (
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                {pdfLoading ? 'Generando...' : 'Descargar PDF'}
              </button>
            )}
          </PDFDownloadLink>

          <button
            onClick={onNewSale}
            className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;