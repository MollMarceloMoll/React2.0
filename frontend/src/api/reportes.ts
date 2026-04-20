import api from "./index";

export const getResumen = (periodo: string) =>
  api.get(`/reportes/resumen?periodo=${periodo}`).then(r => r.data);

export const getGrafico = (periodo: string) =>
  api.get(`/reportes/grafico?periodo=${periodo}`).then(r => r.data);

export const getTopProductos = (periodo: string, limit = 5) =>
  api.get(`/reportes/top-productos?periodo=${periodo}&limit=${limit}`).then(r => r.data);

export const getActividadReciente = (limit = 10) =>
  api.get(`/reportes/actividad-reciente?limit=${limit}`).then(r => r.data);

export const getVentasPorMetodo = (periodo: string) =>
  api.get(`/reportes/ventas-por-metodo?periodo=${periodo}`).then(r => r.data);