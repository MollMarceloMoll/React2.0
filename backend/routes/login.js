/*import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    // Buscar usuario en la base de datos
    const [rows] = await db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Comparar contraseña ingresada con el hash guardado
    const match = await bcrypt.compare(contraseña, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, role: user.role },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1h" }
    );

    // ✅ DEVOLVER TAMBIÉN EL userId
    res.json({ 
      token,
      userId: user.id,
      usuario: user.usuario
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;*/
import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  // 1. Agregamos un log para ver qué llega desde el frontend
  console.log("Datos recibidos en login:", req.body);
  
  const { usuario, password } = req.body;

  try {
    // 2. Buscamos al usuario
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

    if (rows.length === 0) {
      console.log("Usuario no encontrado:", usuario);
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = rows[0];

    // 3. Comparamos contraseña (asumiendo que usas bcrypt)
    // IMPORTANTE: Si guardaste la clave como texto plano para probar, cambia esto.
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.log("Contraseña incorrecta para el usuario:", usuario);
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // 4. Generamos el Token (Asegúrate de tener JWT_SECRET en tus variables de Railway)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secreto_temporal",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: { id: user.id, usuario: user.usuario, role: user.role }
    });

  } catch (error) {
    console.error("Error en el servidor durante el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;