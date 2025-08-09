// config/db.js
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const DIALECT = process.env.BD_DIALECT || 'mysql';
const HOST = process.env.BD_HOST || '127.0.0.1';
const PORT = Number(process.env.BD_PORT) || 3306;
const NAME = process.env.BD_NAME || process.env.DB_NAME;
const USER = process.env.BD_USER || process.env.DB_USER;
const PASS = process.env.BD_PASSWORD || process.env.DB_PASS;

if (!NAME || !USER) {
  console.warn('⚠️ BD_NAME o BD_USER no definidos en .env');
}

const sequelize = new Sequelize(NAME, USER, PASS, {
  host: HOST,
  port: PORT,
  dialect: DIALECT,
  logging: false,
  dialectOptions: { connectTimeout: 60000 },
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

// Forzar uso de mysql2 si el dialecto es mysql (ESM)
try {
  if (DIALECT === 'mysql') {
    const mysql2 = (await import('mysql2')).default;
    sequelize.options.dialectModule = mysql2;
  }
} catch (e) {
  console.warn('mysql2 no disponible, instala con: npm i mysql2');
}

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error?.message || error);
    return false;
  }
};

export default sequelize;
