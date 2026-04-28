import express from "express";
import db from "../db.js";

const router = express.Router();

// Helper: fechas según periodo
function getFechaDesde(periodo, desde, hasta) {
  const now = new Date();
  
  if (periodo === "personalizado" && desde && hasta) {
    return { desde: new Date(desde), hasta: new Date(hasta) };
  }
  
  switch (periodo) {
    case "hoy":
      const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { desde: hoy, hasta: now };
    case "7d":
      return { desde: new Date(now - 7 * 24 * 60 * 60 * 1000), hasta: now };
    case "mes":
      const primerDia = new Date(now.getFullYear(), now.getMonth(), 1);
      return { desde: primerDia, hasta: now };
    case "año":
      const primerDiaAño = new Date(now.getFullYear(), 0, 1);
      return { desde: primerDiaAño, hasta: now };
    default:
      return { desde: new Date(now - 7 * 24 * 60 * 60 * 1000), hasta: now };
  }
}

// GET /api/reportes/resumen
router.get("/resumen", async (req, res) => {
  try {
    const { periodo = "7d", desde, hasta } = req.query;
    const { desde: fechaDesde, hasta: fechaHasta } = getFechaDesde(periodo, desde, hasta);

    const [rows] = await db.query(
      `SELECT 
        COUNT(DISTINCT v.id) as total_ventas,
        COALESCE(SUM(v.total), 0) as ingresos_totales,
        COALESCE(SUM(vd.ganancia_total), 0) as ganancia_total,
        COALESCE(AVG(v.total), 0) as ticket_promedio,
        COALESCE(SUM(v.descuento_total), 0) as descuentos_total,
        COALESCE(SUM(CASE WHEN vd.tipo_venta = 'kg' THEN vd.ganancia_total ELSE 0 END), 0) as ganancia_real_por_kilo,
        COALESCE(SUM(CASE WHEN vd.tipo_venta <> 'kg' OR vd.tipo_venta IS NULL THEN vd.ganancia_total ELSE 0 END), 0) as ganancia_real_unitaria
       FROM ventas v
       LEFT JOIN ventas_detalle vd ON v.id = vd.venta_id
       WHERE v.estado = 'completada' AND v.fecha >= ? AND v.fecha <= ?`,
      [fechaDesde, fechaHasta]
    );

    if (rows.length > 0) {
      const resumen = {
        total_ventas: rows.reduce((acc, r) => acc + r.total_ventas, 0),
        ingresos_totales: rows.reduce((acc, r) => acc + parseFloat(r.ingresos_totales), 0),
        ganancia_total: rows.reduce((acc, r) => acc + parseFloat(r.ganancia_total), 0),
        ticket_promedio: rows.reduce((acc, r) => acc + parseFloat(r.ticket_promedio), 0) / rows.length,
        descuentos_total: rows.reduce((acc, r) => acc + parseFloat(r.descuentos_total), 0),
        ganancia_real_unitaria: rows.reduce((acc, r) => acc + parseFloat(r.ganancia_real_unitaria), 0),
        ganancia_real_por_kilo: rows.reduce((acc, r) => acc + parseFloat(r.ganancia_real_por_kilo), 0)
      };
      res.json(resumen);
    } else {
      res.json({
        total_ventas: 0,
        ingresos_totales: 0,
        ganancia_total: 0,
        ticket_promedio: 0,
        descuentos_total: 0,
        ganancia_real_unitaria: 0,
        ganancia_real_por_kilo: 0
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener resumen" });
  }
});

// GET /api/reportes/grafico
router.get("/grafico", async (req, res) => {
  try {
    const { periodo = "7d", desde, hasta } = req.query;
    const { desde: fechaDesde, hasta: fechaHasta } = getFechaDesde(periodo, desde, hasta);

    const [rows] = await db.query(
      `SELECT 
        DATE(v.fecha) as fecha,
        COALESCE(SUM(v.total), 0) as ingresos,
        COUNT(DISTINCT v.id) as ventas,
        COALESCE(SUM(CASE WHEN vd.tipo_venta = 'kg' THEN vd.ganancia_total ELSE 0 END), 0) as ganancia_real_por_kilo,
        COALESCE(SUM(CASE WHEN vd.tipo_venta <> 'kg' OR vd.tipo_venta IS NULL THEN vd.ganancia_total ELSE 0 END), 0) as ganancia_real_unitaria
       FROM ventas v
       LEFT JOIN ventas_detalle vd ON v.id = vd.venta_id
       WHERE v.estado = 'completada' AND v.fecha >= ? AND v.fecha <= ?
       GROUP BY DATE(v.fecha)
       ORDER BY fecha ASC`,
      [fechaDesde, fechaHasta]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener datos del gráfico" });
  }
});

// GET /api/reportes/top-productos
router.get("/top-productos", async (req, res) => {
  try {
    const { periodo = "7d", desde, hasta, limit = 5 } = req.query;
    const { desde: fechaDesde, hasta: fechaHasta } = getFechaDesde(periodo, desde, hasta);

    const [rows] = await db.query(
      `SELECT 
        p.id,
        p.nombre,
        p.categoria,
        p.precio_venta,
        p.precio_compra,
        p.precio_venta_kg,
        p.peso_bolsa_kg,
        SUM(vd.cantidad) as total_cantidad,
        SUM(vd.subtotal) as total_ingresos,
        COUNT(DISTINCT vd.venta_id) as num_ventas,
        COALESCE(SUM(CASE WHEN vd.tipo_venta = 'kg' THEN vd.ganancia_total ELSE 0 END), 0) as ganancia_real_por_kilo,
        COALESCE(SUM(CASE WHEN vd.tipo_venta <> 'kg' OR vd.tipo_venta IS NULL THEN vd.ganancia_total ELSE 0 END), 0) as ganancia_real_unitaria
       FROM ventas_detalle vd
       JOIN productos p ON vd.producto_id = p.id
       JOIN ventas v ON vd.venta_id = v.id
       WHERE v.estado = 'completada' AND v.fecha >= ? AND v.fecha <= ?
       GROUP BY p.id, p.nombre, p.categoria, p.precio_venta, p.precio_compra, p.precio_venta_kg, p.peso_bolsa_kg
       ORDER BY total_cantidad DESC
       LIMIT ?`,
      [fechaDesde, fechaHasta, parseInt(limit)]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener top productos" });
  }
});

// GET /api/reportes/actividad-reciente
router.get("/actividad-reciente", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const [rows] = await db.query(
      `SELECT 
        v.id,
        v.nombre_cliente,
        v.total,
        v.metodo_pago,
        v.fecha,
        u.usuario as vendedor
       FROM ventas v
       LEFT JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.estado = 'completada'
       ORDER BY v.fecha DESC
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener actividad reciente" });
  }
});

// GET /api/reportes/ventas-por-metodo
router.get("/ventas-por-metodo", async (req, res) => {
  try {
    const { periodo = "7d", desde, hasta } = req.query;
    const { desde: fechaDesde, hasta: fechaHasta } = getFechaDesde(periodo, desde, hasta);

    const [rows] = await db.query(
      `SELECT 
        metodo_pago,
        COUNT(DISTINCT v.id) as cantidad,
        SUM(total) as total,
        COALESCE(SUM(vd.ganancia_total), 0) as ganancia_real_unitaria
       FROM ventas v
       LEFT JOIN ventas_detalle vd ON v.id = vd.venta_id
       WHERE v.estado = 'completada' AND v.fecha >= ? AND v.fecha <= ?
       GROUP BY metodo_pago`,
      [fechaDesde, fechaHasta]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener ventas por método" });
  }
});

export default router;