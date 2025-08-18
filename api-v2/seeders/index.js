// seeders/index.js
import sequelize from '../config/db.js';
import '../models/index.js'; // asegúrate que registra todas las asociaciones

import { seedPersonas } from './personaSeeder.js';
import { seedUsuarios } from './usuarioSeeder.js';
import { seedTrabajadores } from './trabajadorSeeder.js';
import { seedAutobuses } from './autobusSeeder.js';
import { seedRutas } from './rutaSeeder.js';
import { seedHorarios } from './horarioSeeder.js';
import { seedBoletos } from './boletoSeeder.js';

const run = async () => {
  try {
    console.log('🔄 sync...');
    await sequelize.sync({ force: true }); // Borra y recrea tablas

    const ctx = { models: sequelize.models };

    const personas = await seedPersonas(ctx, 200);
    const usuarios = await seedUsuarios({ ...ctx, personas }, 3);
    const trabajadores = await seedTrabajadores({ ...ctx, usuarios }, 0.5);

    const conductores = trabajadores.filter(t => t.puesto === 'conductor');
    const autobuses = await seedAutobuses({ ...ctx, conductores }, 30);

    const rutas = await seedRutas({ ...ctx, autobuses }, 20);
    const horarios = await seedHorarios({ ...ctx, rutas }, 5);

    await seedBoletos({ ...ctx, usuarios, rutas, autobuses, horarios }, 10, 100);

    console.log('✅ Seed completo');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  }
};

run();
