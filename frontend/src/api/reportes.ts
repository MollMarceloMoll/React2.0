import api from "./index";

export const getResumen = (queryString: string) =>
  api.get(`/reportes/resumen${queryString}`).then(r => r.data);

export const getGrafico = (queryString: string) =>
  api.get(`/reportes/grafico${queryString}`).then(r => r.data);

export const getTopProductos = (queryString: string, limit = 5) =>
  api.get(`/reportes/top-productos${queryString}&limit=${limit}`).then(r => r.data);

export const getActividadReciente = (limit = 10) =>
  api.get(`/reportes/actividad-reciente?limit=${limit}`).then(r => r.data);

export const getVentasPorMetodo = (queryString: string) =>
  api.get(`/reportes/ventas-por-metodo${queryString}`).then(r => r.data);