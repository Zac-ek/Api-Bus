// app.js
import express from 'express';
import sequelize, { testConnection } from './config/db.js';
import { ensureDatabase } from './config/ensureDb.js'; // opcional
import swaggerDocs from './config/swagger.js';
import './models/index.js'; // IMPORTANTE: registra modelos y asociaciones
import authRoutes from './routes/auth.routes.js';
import autobusRoutes from './routes/autobus.routes.js';
import boletosRoutes from './routes/boletos.routes.js';
import personaRoutes from './routes/personas.routes.js';
import usuarioRoutes from './routes/usuarios.routes.js';
import hoariosRoutes from './routes/horarios.routes.js';
import rutaRoutes from './routes/rutas.routes.js';
import trabajadorRoutes from './routes/trabajadores.routes.js';
import viajeRoutes from './routes/viajes.routes.js';

import cors from 'cors';

const app = express();
const PORT = process.env.APP_PORT || 3000;


app.use(cors());

app.use(express.json());

app.use('/api', viajeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/autobuses', autobusRoutes);
app.use('/api/boletos', boletosRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/horarios', hoariosRoutes);
app.use('/api/rutas', rutaRoutes);
app.use('/api/trabajadores', trabajadorRoutes);

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
