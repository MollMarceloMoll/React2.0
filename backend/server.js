// Importamos las dependencias
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRouter from "./routes/login.js";
import ventasRouter from "./routes/ventas.js";

dotenv.config(); // lee las variables del archivo .env

// Configuramos el servidor
const app = express();
app.use(cors()); // permite que el forntend se conecte al backend
app.use(express.json()); // para leer el JSON en requests
app.use("/api/ventas", ventasRouter);

// Conexion a MySQL
const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "forrajeria_db"
});

// Definimos las rutas

// 🔑 CAMBIO PRINCIPAL: Obtener TODOS los productos (sin filtro)
app.get("/api/productos", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos"); // ✅ Sin WHERE
        res.json(rows);
    } catch (error) {
        res.status(500).json({error : "Error al obtener productos"});
    }
});

// Rutas adicionales (opcionales, para consultas específicas)
app.get("/api/mascotas", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos WHERE categoria = 'mascota'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error : "Error al obtener mascotas"});
    }
});

app.get("/api/granja", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos WHERE categoria = 'granja'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener granja"})
    }
})

app.get("/api/accesorios", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos WHERE categoria = 'accesorio'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener accesorios"})
    }
})

app.get("/api/veterinaria", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM productos WHERE categoria = 'veterinaria'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener veterinaria"})
    }
})


// Ruta para guardar cualquier producto (mascota, granja, accesorio, veterinaria)
app.post("/api/productos", async (req, res) => {
    try {
        const {
            nombre,
            precio_compra,
            precio_venta,
            precio_venta_kg = null,
            peso_bolsa_kg = null,
            stock_unidades,
            categoria,
            animal = null,
            etapa = null,
            proteinas = null,
            sabor = null,
            calidad = null,
            color = null,
            talle = null
        } = req.body;

        const [result] = await db.query(
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


// Ruta para actualizar cualquier producto (mascota, granja, accesorio, veterinaria)
app.put("/api/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre, 
            precio_compra, 
            precio_venta,
            precio_venta_kg = null, 
            peso_bolsa_kg = null,
            stock_unidades, 
            categoria, 
            animal = null,
            etapa = null, 
            proteinas = null, 
            sabor = null,
            calidad = null, 
            color = null, 
            talle = null
        } = req.body;

        await db.query(
            `UPDATE productos SET
                nombre=?, precio_compra=?, precio_venta=?, precio_venta_kg=?,
                peso_bolsa_kg=?, stock_unidades=?, categoria=?, animal=?,
                etapa=?, proteinas=?, sabor=?, calidad=?, color=?, talle=?
             WHERE id=?`,
            [nombre, precio_compra, precio_venta, precio_venta_kg, peso_bolsa_kg,
             stock_unidades, categoria, animal, etapa, proteinas, sabor, calidad,
             color, talle, id]
        );

        res.json({ message: "Producto actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});


// Rutas de login
app.use("/api", loginRouter);

// Iniciamos el servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});