// config/ensureDb.js
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const DIALECT = process.env.BD_DIALECT || 'mysql';
const HOST = process.env.BD_HOST || '127.0.0.1';
const PORT = Number(process.env.BD_PORT) || 3306;
const NAME = process.env.BD_NAME || process.env.DB_NAME;
const USER = process.env.BD_USER || process.env.DB_USER;
const PASS = process.env.BD_PASSWORD || process.env.DB_PASS;

export async function ensureDatabase() {
  if (!NAME) throw new Error('BD_NAME/DB_NAME no definido');
  const admin = new Sequelize('', USER, PASS, {
    host: HOST,
    port: PORT,
    dialect: DIALECT,
    logging: false,
  });
  await admin.query(
    `CREATE DATABASE IF NOT EXISTS \`${NAME}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await admin.close();
  console.log(`🆗 BD "${NAME}" verificada/creada`);
}
