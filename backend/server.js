import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRouter from "./routes/login.js";
import ventasRouter from "./routes/ventas.js";
import reportesRouter from "./routes/reportes.js";
import usuariosRouter from "./routes/usuarios.js";
import pool from './db.js'; // Usaremos este para TODO

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas externas
app.use("/api/ventas", ventasRouter);
app.use("/api/reportes", reportesRouter);
app.use("/api", loginRouter);
app.use("/api/usuarios", usuariosRouter);

// --- RUTAS DE PRODUCTOS (Cambiadas de 'db' a 'pool') ---

app.get("/api/productos", async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos"); 
        res.json(rows);
    } catch (error) {
        res.status(500).json({error : "Error al obtener productos"});
    }
});

app.get("/api/mascotas", async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos WHERE categoria = 'mascota'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error : "Error al obtener mascotas"});
    }
});

app.get("/api/granja", async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos WHERE categoria = 'granja'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener granja"})
    }
});

app.post("/api/productos", async (req, res) => {
    try {
        const {
            nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg,
            stock_unidades, categoria, animal, etapa, proteinas, sabor, calidad, color, talle
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO productos 
                (nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg, 
                 stock_unidades, categoria, animal, etapa, proteinas, sabor, calidad, color, talle) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg,
             stock_unidades, categoria, animal, etapa, proteinas, sabor, calidad, color, talle]
        );
        res.status(201).json({ message: "Producto guardado", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar producto" });
    }
});

// --- PUERTO Y ARRANQUE ---

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});