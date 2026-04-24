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

// 1. CONFIGURACIÓN DE CORS PROFESIONAL
const corsOptions = {
    origin: function (origin, callback) {
        // Permitimos localhost y cualquier subdominio de Vercel
        if (!origin || origin.includes(".vercel.app") || origin.includes("localhost")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-requested-with"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. DEFINICIÓN DEL ROUTER PRINCIPAL (/api)
const apiRouter = express.Router();

// Ruta de "Salud" para evitar el 404 cuando el front llama a la base de la API
apiRouter.get("/", (req, res) => {
    res.json({ message: "API de Programa Ventas operativa 🚀" });
});

// Rutas de Productos
apiRouter.get("/productos", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos");
        res.json(rows);
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

apiRouter.get("/mascotas", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM productos WHERE categoria = 'mascota'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener mascotas" });
    }
});

// 3. INTEGRACIÓN DE ROUTERS EXTERNOS
// Todos colgarán de /api/nombre_del_recurso
apiRouter.use("/ventas", ventasRouter);
apiRouter.use("/reportes", reportesRouter);
apiRouter.use("/usuarios", usuariosRouter);
apiRouter.use("/", loginRouter); // Maneja /api/login y /api/registro si existen

// Montamos el router en la aplicación
app.use("/api", apiRouter);

// 4. RUTA INFORMATIVA (Raíz del dominio)
app.get("/", (req, res) => {
    res.send("Servidor Backend de Railway funcionando correctamente.");
});

// 5. MIDDLEWARE DE DEPURACIÓN (Manejo de 404 real)
app.use((req, res) => {
    console.log(`[404] Intento de acceso a ruta inexistente: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: "Ruta no encontrada", 
        path: req.url 
    });
});

// 6. ARRANQUE DEL SERVIDOR
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor Senior activo en puerto ${PORT}`);
});