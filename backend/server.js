// Importamos las dependencias
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRouter from "./routes/login.js";

dotenv.config(); // lee las variables del archivo .env

// Configuramos el servidor
const app = express();
app.use(cors()); // permite que el forntend se conecte al backend
app.use(express.json()); // para leer el JSON en requests

// Conexion a MySQL
const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "forrajeria_db"
});

// Definimos las rutas

// Ruta para obtener la LISTA MASCOTAS
app.get("/api/productos", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos WHERE categoria = 'mascota'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error : "Error al obtener lista accesorios"});
    }
});

// Ruta para obtener la LISTA GRANJA
app.get("/api/granja", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos WHERE categoria = 'granja'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener lista granja"})
    }
})

// Ruta para obtener la LISTA ACCESORIOS
app.get("/api/accesorios", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos WHERE categoria = 'accesorio'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener lista accesorios"})
    }
})

// Ruta para guadar alimento para mascotas
app.post("/api/productos", async (req, res) => {
    try {
        const {
            nombre,
            precio_compra,
            precio_venta,
            precio_venta_kg,
            peso_bolsa_kg,
            stock_unidades,
            categoria,
            animal,
            etapa,
            proteinas,
            sabor,
            calidad
        } = req.body;

         const [result] = await db.query(
            `INSERT INTO productos 
                (nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg, stock_unidades, categoria, animal, etapa, proteinas, sabor, calidad) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg, stock_unidades, categoria, animal, etapa, proteinas, sabor, calidad]
        );
    res.status(201).json({ message: "Producto guardado", id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al guardar producto" });
        }
});

// Ruta para guadar alimento para granja
app.post("/api/productos", async (req, res) => {
    try {
        const {
            nombre,
            precio_compra,
            precio_venta,
            precio_venta_kg,
            peso_bolsa_kg,
            stock_unidades,
            categoria,
            animal,
            etapa,
            proteinas,
            calidad
        } = req.body;

         const [result] = await db.query(
            `INSERT INTO productos 
                (nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg, stock_unidades, categoria, animal, etapa, proteinas, calidad) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg, stock_unidades, categoria, animal, etapa, proteinas, calidad]
        );
    res.status(201).json({ message: "Producto guardado", id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al guardar producto" });
        }
});

// Ruta para guadar accesorios
app.post("/api/productos", async (req, res) => {
    try {
        const {
            nombre,
            precio_compra,
            precio_venta,
            stock_unidades,
            categoria,
            animal,
            etapa,
            color,
            talle,
            calidad
        } = req.body;

         const [result] = await db.query(
            `INSERT INTO productos 
                (nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg, stock_unidades, categoria, animal, etapa, proteinas, calidad) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, precio_compra, precio_venta, stock_unidades, categoria, animal, etapa, color, talle, calidad]
        );
    res.status(201).json({ message: "Producto guardado", id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al guardar producto" });
        }
});

// Rutas de login
app.use("/api", loginRouter);

// Iniciamos el servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});