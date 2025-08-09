import express from 'express';
import sequelize, { testConnection } from './config/db.js';

// ... (otros imports)

const app = express();
const PORT = process.env.APP_PORT || 3000;  // Usar variable de entorno

// ... (configuración de middleware y rutas)

// Iniciar servidor después de probar la conexión
const startServer = async () => {
  const isDbConnected = await testConnection();
  
  if (isDbConnected) {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
    
    // Sincronizar modelos (opcional)
    try {
      await sequelize.sync({ force: false });
      console.log('🔄 Modelos sincronizados con la base de datos');
    } catch (syncError) {
      console.error('❌ Error al sincronizar modelos:', syncError);
    }
  } else {
    console.error('⛔ No se pudo iniciar el servidor debido a problemas con la base de datos');
    process.exit(1);  // Salir con código de error
  }
};

startServer();