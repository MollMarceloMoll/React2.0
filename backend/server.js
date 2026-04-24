/*import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRouter from "./routes/login.js";
import ventasRouter from "./routes/ventas.js";
import reportesRouter from "./routes/reportes.js";
import usuariosRouter from "./routes/usuarios.js";
import pool from './db.js'; 

dotenv.config();

const app = express();

// --- CONFIGURACIÓN DE CORS MEJORADA ---
// En backend/server.js
app.use(cors({
    origin: function (origin, callback) {
        // Esto permite cualquier subdominio de vercel.app o localhost
        if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// Rutas externas
app.use("/api/ventas", ventasRouter);
app.use("/api/reportes", reportesRouter);
app.use("/api", loginRouter);
app.use("/api/usuarios", usuariosRouter);

// --- RUTAS DE PRODUCTOS ---

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

// Ruta raíz para evitar el "Cannot GET /"
app.get("/", (req, res) => {
    res.send("Servidor de Programa Ventas (Railway) activo 🚀");
});

// --- PUERTO Y ARRANQUE ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});*/

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRouter from "./routes/login.js";
import ventasRouter from "./routes/ventas.js";
import reportesRouter from "./routes/reportes.js";
import usuariosRouter from "./routes/usuarios.js";
import pool from './db.js'; 

dotenv.config();
const app = express();

// 1. CORS Dinámico para Vercel
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin.includes(".vercel.app") || origin.includes("localhost")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. RUTAS DE PRODUCTOS (Directas en /api)
// Ponemos esto ANTES de los routers para asegurar que se registren
app.get("/api/productos", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos");
        res.json(rows);
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// 3. REGISTRO DE ROUTERS EXTERNOS
app.use("/api/ventas", ventasRouter);
app.use("/api/reportes", reportesRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api", loginRouter); // Esto cubre /api/login

// 4. RUTA RAÍZ (Para que Railway no de error al entrar al link directo)
app.get("/", (req, res) => {
    res.send("Servidor de Programa Ventas (Railway) activo 🚀");
});

// 5. MANEJO DE RUTAS NO ENCONTRADAS (Para debuggear el 404)
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({ message: `La ruta ${req.url} no existe en este servidor.` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});