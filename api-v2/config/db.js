import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Cargar variables de entorno
dotenv.config();

const sequelize = new Sequelize(
  process.env.BD_NAME,
  process.env.BD_USER,
  process.env.BD_PASSWORD,
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,  // Puerto personalizado
    dialect: process.env.BD_DIALECT,
    logging: process.env.APP_ENV === 'development' ? console.log : false,
    dialectOptions: {
      // Opciones adicionales para MySQL
      connectTimeout: 60000, // 1 minuto de timeout
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌Error al conectar a la base de datos:', error);
    return false;
  }
};

export default sequelize;