import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const normalizeBcryptHash = (storedHash) => {
    if (!storedHash || typeof storedHash !== "string") return null;
    if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
        return storedHash;
    }

    // Formato legacy detectado: b10 + 53 chars (sin "$2b$" ni separadores).
    const legacyMatch = storedHash.match(/^b(\d{2})([./A-Za-z0-9]{53})$/);
    if (legacyMatch) {
        const [, cost, body] = legacyMatch;
        return `$2b$${cost}$${body}`;
    }

    return null;
};

router.post("/login", async (req, res) => {
    const { usuario, contraseña } = req.body;
    console.log("Datos recibidos en login:", { usuario, contraseña });

    try {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Aquí definimos a 'user' dentro del bloque try
        const user = rows[0];
        console.log("Hash detectado en DB:", user.passwordHash);

        const normalizedHash = normalizeBcryptHash(user.passwordHash);
        if (!normalizedHash) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(contraseña, normalizedHash);
        } catch (err) {
            console.error("Error validando hash bcrypt:", err);
        }

        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Si el hash estaba en formato legacy, lo normalizamos en DB al iniciar sesion.
        if (normalizedHash !== user.passwordHash) {
            await pool.query("UPDATE usuarios SET passwordHash = ? WHERE id = ?", [normalizedHash, user.id]);
        }

        // Generación de Token
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
        console.error("Error crítico en el servidor:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;