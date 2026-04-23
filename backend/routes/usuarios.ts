import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { pool } from '../config/database';

const router = Router();

// Middleware para validar token (implementa según tu sistema de autenticación)
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  req.userId = parseInt(userId as string);
  next();
};

// Esquemas de validación
const emailChangeSchema = Joi.object({
  newEmail: Joi.string().email().required(),
  currentPassword: Joi.string().required()
});

const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

// Cambiar correo electrónico
router.post('/change-email', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = emailChangeSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { newEmail, currentPassword } = value;
    const userId = req.userId;

    // Obtener usuario actual
    const [users] = await pool.query(
      'SELECT id, email, passwordHash FROM usuarios WHERE id = ?',
      [userId]
    ) as any[];

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    // Verificar contraseña actual
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Verificar que el nuevo email no esté en uso
    const [existingEmail] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [newEmail, userId]
    ) as any[];

    if (existingEmail.length > 0) {
      return res.status(409).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Actualizar correo
    await pool.query(
      'UPDATE usuarios SET email = ? WHERE id = ?',
      [newEmail, userId]
    );

    res.json({ 
      message: 'Correo electrónico actualizado exitosamente',
      newEmail 
    });

  } catch (error) {
    console.error('Error al cambiar email:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Cambiar contraseña
router.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = passwordChangeSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { currentPassword, newPassword } = value;
    const userId = req.userId;

    // Obtener usuario actual
    const [users] = await pool.query(
      'SELECT id, passwordHash FROM usuarios WHERE id = ?',
      [userId]
    ) as any[];

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    // Verificar contraseña actual
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Verificar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    
    if (isSamePassword) {
      return res.status(400).json({ error: 'La nueva contraseña debe ser diferente a la actual' });
    }

    // Hash de la nueva contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await pool.query(
      'UPDATE usuarios SET passwordHash = ? WHERE id = ?',
      [passwordHash, userId]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;