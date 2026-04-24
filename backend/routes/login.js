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
  console.log("Datos recibidos en login:", req.body);
  
  // Extraemos 'contraseña' porque así viene desde tu frontend según los logs
  const { usuario, contraseña } = req.body; 

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Validamos que el hash exista en la DB para que no explote bcrypt
    if (!user.passwordHash) {
        console.error("El usuario no tiene un hash de contraseña en la DB");
        return res.status(500).json({ message: "Error de configuración de usuario" });
    }

    // Usamos 'contraseña' que es lo que recibimos
    const isMatch = await bcrypt.compare(contraseña, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

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
    console.error("Error detallado:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;