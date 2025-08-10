import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export const authenticate = (req, res, next) => {
  // 1. Obtener token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Acceso denegado. No se proporcionó token.' 
    });
  }

  try {
    // 2. Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Añadir datos del usuario al request
    next();
  } catch (error) {
    res.status(400).json({ 
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