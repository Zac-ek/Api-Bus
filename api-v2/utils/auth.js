import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_para_desarrollo';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Generar token JWT
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: EXPIRES_IN
  });
};

// Verificar token JWT
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

// Hash de contraseña
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparar contraseña con hash
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};