import express from "express";
import db from "../db.js";

const router = express.Router();

// Helper: fechas según periodo
function getFechaDesde(periodo) {
  const now = new Date();
  switch (periodo) {
    case "hoy":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "mes":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "año":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
  }
}

// GET /api/reportes/resumen?periodo=7d
router.get("/resumen", async (req, res) => {
  try {
    const { periodo = "7d" } = req.query;
    const desde = getFechaDesde(periodo);

    const [rows] = await db.query(
      `SELECT 
        COUNT(*) as total_ventas,
        COALESCE(SUM(total), 0) as ganancia_total,
        COALESCE(AVG(total), 0) as ticket_promedio,
        COALESCE(SUM(descuento_total), 0) as descuentos_total
       FROM ventas 
       WHERE estado = 'completada' AND fecha >= ?`,
      [desde]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener resumen" });
  }
});

// GET /api/reportes/grafico?periodo=7d
router.get("/grafico", async (req, res) => {
  try {
    const { periodo = "7d" } = req.query;
    const desde = getFechaDesde(periodo);

    const [rows] = await db.query(
      `SELECT 
        DATE(fecha) as fecha,
        COALESCE(SUM(total), 0) as ganancia,
        COUNT(*) as ventas
       FROM ventas
       WHERE estado = 'completada' AND fecha >= ?
       GROUP BY DATE(fecha)
       ORDER BY fecha ASC`,
      [desde]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener datos del gráfico" });
  }
});

// GET /api/reportes/top-productos?periodo=7d&limit=5
router.get("/top-productos", async (req, res) => {
  try {
    const { periodo = "7d", limit = 5 } = req.query;
    const desde = getFechaDesde(periodo);

    const [rows] = await db.query(
      `SELECT 
        p.nombre,
        p.categoria,
        SUM(vd.cantidad) as total_cantidad,
        SUM(vd.subtotal) as total_ingresos,
        COUNT(DISTINCT vd.venta_id) as num_ventas
       FROM ventas_detalle vd
       JOIN productos p ON vd.producto_id = p.id
       JOIN ventas v ON vd.venta_id = v.id
       WHERE v.estado = 'completada' AND v.fecha >= ?
       GROUP BY p.id, p.nombre, p.categoria
       ORDER BY total_cantidad DESC
       LIMIT ?`,
      [desde, parseInt(limit)]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener top productos" });
  }
});

// GET /api/reportes/actividad-reciente?limit=10
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

// GET /api/reportes/ventas-por-metodo?periodo=7d
router.get("/ventas-por-metodo", async (req, res) => {
  try {
    const { periodo = "7d" } = req.query;
    const desde = getFechaDesde(periodo);

    const [rows] = await db.query(
      `SELECT 
        metodo_pago,
        COUNT(*) as cantidad,
        SUM(total) as total
       FROM ventas
       WHERE estado = 'completada' AND fecha >= ?
       GROUP BY metodo_pago`,
      [desde]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener ventas por método" });
  }
});

export default router;