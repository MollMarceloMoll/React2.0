import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../db.js"; // tu conexión a MySQL

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
      "secreto", // clave privada, cámbiala por una más segura
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
