import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_para_desarrollo';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const DB_CONFIG = {
  name: process.env.DB_NAME || 'transport_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: process.env.DB_DIALECT || 'mysql'
};