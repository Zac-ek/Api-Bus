// models/index.js
import sequelize from '../config/db.js';

// Orden recomendado (padres → hijos):
import './persona.js';     // Personas
import './usuario.js';     // Usuarios (depende de Persona)
import './trabajador.js';  // Trabajadores (depende de Usuario)
import './autobus.js';     // Autobuses (depende de Trabajador)
import './ruta.js';        // Rutas (depende de Autobus)
import './horario.js';     // Horarios (depende de Ruta)
import './boleto.js';      // Boletos (depende de Usuario, Ruta, Autobus, Horario)

// Ejecuta associate() si existe
const { models } = sequelize;
Object.values(models).forEach((m) => {
  if (typeof m.associate === 'function') m.associate(models);
});
