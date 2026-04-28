import express from "express";
import db from "../db.js";

const router = express.Router();

// 🔍 BUSCAR PRODUCTOS (con debounce desde frontend)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query; // query parameter
    if (!q || q.length < 2) {
      return res.status(400).json({ error: "Búsqueda muy corta" });
    }

    const [productos] = await db.query(
      "SELECT id, nombre, precio_venta, precio_venta_kg, peso_bolsa_kg, stock_unidades, stock_kg, categoria FROM productos WHERE nombre LIKE ? AND activo = 1",
      [`%${q}%`]
    );

    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en búsqueda" });
  }
});

// 📝 GUARDAR VENTA (CON TRANSACCIÓN - MÁS IMPORTANTE)
router.post("/", async (req, res) => {
  const connection = await db.getConnection(); // Obtener conexión para transacción
  
  try {
    const {
      nombre_cliente,
      metodo_pago,
      items, // Array de artículos a vender
      descuento_total,
      total,
      usuario_id,
    } = req.body;

    // Validar datos
    if (!nombre_cliente || !metodo_pago || !items || items.length === 0) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    await connection.beginTransaction();

    let total_venta = 0;
    const movimientos = [];

    // PASO 1: Validar stock disponible ANTES de insertar
    for (const item of items) {
      const [producto] = await connection.query(
        "SELECT stock_unidades, stock_kg, categoria FROM productos WHERE id = ?",
        [item.producto_id]
      );

      if (producto.length === 0) {
        throw new Error(`Producto ${item.producto_id} no encontrado`);
      }

      const prod = producto[0];

      // Validar stock según tipo
      if (prod.categoria === "alimento") {
        if (prod.stock_kg < item.cantidad) {
          throw new Error(
            `Stock insuficiente de ${item.nombre}. Disponible: ${prod.stock_kg}kg`
          );
        }
      } else {
        if (prod.stock_unidades < item.cantidad) {
          throw new Error(
            `Stock insuficiente de ${item.nombre}. Disponible: ${prod.stock_unidades} unidades`
          );
        }
      }
    }

    // PASO 2: Insertar venta
    const [ventaResult] = await connection.query(
      `INSERT INTO ventas 
        (nombre_cliente, metodo_pago, descuento_total, total, usuario_id, estado) 
       VALUES (?, ?, ?, ?, ?, 'completada')`,
      [nombre_cliente, metodo_pago, descuento_total || 0, total, usuario_id]
    );

    const venta_id = ventaResult.insertId;

    // PASO 3: Insertar detalles de venta y descontar stock
    for (const item of items) {
      // Obtener stock ANTES de descontar
      const [productoAntes] = await connection.query(
        "SELECT stock_kg, stock_unidades, categoria, precio_compra, peso_bolsa_kg FROM productos WHERE id = ?",
        [item.producto_id]
      );

      const stockAnterior =
        productoAntes[0].categoria === "alimento"
          ? productoAntes[0].stock_kg
          : productoAntes[0].stock_unidades;

      const cantidad = Number(item.cantidad) || 0;
      const precioUnitario = Number(item.precio_unitario) || 0;
      const descuento = Number(item.descuento) || 0;
      const subtotal = Number(item.subtotal) || precioUnitario * cantidad;
      const precioCompra = Number(productoAntes[0].precio_compra) || 0;
      const pesoBolsaKg = Number(productoAntes[0].peso_bolsa_kg) || 0;

      let costoUnitario = precioCompra;
      if (item.tipo_venta === "kg") {
        costoUnitario = pesoBolsaKg > 0 ? precioCompra / pesoBolsaKg : 0;
      }

      const costoTotal = costoUnitario * cantidad;
      const ingresoNeto = subtotal - descuento;
      const gananciaTotal = ingresoNeto - costoTotal;

      // Insertar línea de venta con snapshot de costos/ganancia
      await connection.query(
        `INSERT INTO ventas_detalle 
            (venta_id, producto_id, tipo_venta, cantidad, precio_unitario, subtotal, descuento, costo_unitario, costo_total, ganancia_total) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            venta_id,
            item.producto_id,
            item.tipo_venta,
            cantidad,
            precioUnitario,
            subtotal,
            descuento,
            costoUnitario,
            costoTotal,
            gananciaTotal,
        ]
      );

      // Descontar del stock
      if (productoAntes[0].categoria === "alimento") {
        const [prodInfo] = await connection.query(
            "SELECT peso_bolsa_kg, bolsas_disponibles, bolsas_parciales FROM productos WHERE id = ?",
            [item.producto_id]
        );
        
        const peso_bolsa = prodInfo[0].peso_bolsa_kg;
        let bolsas_dispo = prodInfo[0].bolsas_disponibles;
        let bolsas_parci = prodInfo[0].bolsas_parciales;
        
        let cantidad_a_descontar = item.cantidad;
        
        // Si vende bolsa completa
        if (item.tipo_venta === "bolsa") {
            bolsas_dispo -= 1;
        } 
        // Si vende kg
        else if (item.tipo_venta === "kg") {
            // Primero de las parciales
            if (bolsas_parci >= cantidad_a_descontar) {
            bolsas_parci -= cantidad_a_descontar;
            } else {
            // Si no hay parciales, abro una bolsa completa
            cantidad_a_descontar -= bolsas_parci;
            bolsas_parci = 0;
            
            if (cantidad_a_descontar >= peso_bolsa) {
                bolsas_dispo -= Math.floor(cantidad_a_descontar / peso_bolsa);
                bolsas_parci = cantidad_a_descontar % peso_bolsa;
            } else {
                bolsas_parci = peso_bolsa - cantidad_a_descontar;
            }
            }
        }
  
  const stock_total = (bolsas_dispo * peso_bolsa) + bolsas_parci;
  
  await connection.query(
    "UPDATE productos SET stock_kg = ?, bolsas_disponibles = ?, bolsas_parciales = ? WHERE id = ?",
    [stock_total, bolsas_dispo, bolsas_parci, item.producto_id]
  );
}

      // Obtener stock DESPUÉS de descontar
      const [productoDepues] = await connection.query(
        "SELECT stock_kg, stock_unidades FROM productos WHERE id = ?",
        [item.producto_id]
      );

      const stockNuevo =
        productoAntes[0].categoria === "alimento"
          ? productoDepues[0].stock_kg
          : productoDepues[0].stock_unidades;

      // Registrar movimiento
      movimientos.push({
        producto_id: item.producto_id,
        tipo_movimiento: "venta",
        cantidad: cantidad,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        venta_id: venta_id,
        usuario_id: usuario_id,
      });
    }

    // PASO 4: Insertar movimientos en tabla stock_movimientos
    for (const movimiento of movimientos) {
      await connection.query(
        `INSERT INTO stock_movimientos 
          (producto_id, tipo_movimiento, cantidad, stock_anterior, stock_nuevo, venta_id, usuario_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          movimiento.producto_id,
          movimiento.tipo_movimiento,
          movimiento.cantidad,
          movimiento.stock_anterior,
          movimiento.stock_nuevo,
          movimiento.venta_id,
          movimiento.usuario_id,
        ]
      );
    }

    // ✅ COMMIT: Todo salió bien
    await connection.commit();

    res.status(201).json({
      message: "Venta registrada correctamente",
      venta_id: venta_id,
    });
  } catch (error) {
    // ❌ ROLLBACK: Algo salió mal
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: error.message || "Error al registrar venta" });
  } finally {
    connection.release();
  }
});

// 📋 OBTENER TODAS LAS VENTAS
router.get("/", async (req, res) => {
  try {
    const [ventas] = await db.query(`
      SELECT v.*, 
             COUNT(vd.id) as cantidad_items
      FROM ventas v
      LEFT JOIN ventas_detalle vd ON v.id = vd.venta_id
      GROUP BY v.id
      ORDER BY v.fecha DESC
      LIMIT 100
    `);

    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});

// 📄 OBTENER DETALLES DE UNA VENTA (para comprobante)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener datos de la venta
    const [venta] = await db.query("SELECT * FROM ventas WHERE id = ?", [id]);
    if (venta.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Obtener detalles de la venta
    const [detalles] = await db.query(
      `SELECT vd.*, p.nombre 
       FROM ventas_detalle vd
       JOIN productos p ON vd.producto_id = p.id
       WHERE vd.venta_id = ?`,
      [id]
    );

    res.json({
      venta: venta[0],
      detalles: detalles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener venta" });
  }
});

export default router;