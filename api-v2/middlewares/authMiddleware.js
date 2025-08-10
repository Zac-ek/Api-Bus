import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import Usuario from '../models/usuario.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Acceso no autorizado' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['contrasena_hash'] }
    });

    if (!usuario || !usuario.is_active) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no autorizado' 
      });
    }

    req.user = usuario;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token inválido o expirado' 
    });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'No tienes permisos para esta acción' 
      });
    }
    next();
  };
};