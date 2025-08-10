// app.js
import express from 'express';
import sequelize, { testConnection } from './config/db.js';
import { ensureDatabase } from './config/ensureDb.js'; // opcional
import swaggerDocs from './config/swagger.js';
import './models/index.js'; // IMPORTANTE: registra modelos y asociaciones
import authRoutes from './routes/authRoutes.js';
import personaRoutes from './routes/persona.js';
import usuarioRoutes from './routes/usuario.js';

const app = express();
const PORT = process.env.APP_PORT || 3000;

// middlewares
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/usuarios', usuarioRoutes);

swaggerDocs(app);

const startServer = async () => {
  try {
    await ensureDatabase();

    const ok = await testConnection();
    if (!ok) {
      console.error('⛔ No se pudo iniciar el servidor por problemas con la BD');
      process.exit(1);
    }

    console.log('🧩 Modelos registrados:', Object.keys(sequelize.models));

    await sequelize.sync({ alter: true });
    console.log('🔄 Modelos sincronizados con la base de datos');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar:', err);
    process.exit(1);
  }
};

startServer();
