// seeders/index.js
import sequelize from '../config/db.js';
import '../models/index.js';

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
    await sequelize.sync({ force: true }); // ⚠️ borra y recrea tablas

    const ctx = { models: sequelize.models };


    // 1) Personas (con algunas tipo 'trabajador')
    const { personas, personasTrabajadorIds } = await seedPersonas(ctx, 400, 0.30);

    // 2) Usuarios (1:1 con Persona) + mapa personaId -> usuario
    const { usuarios, mapPersonaToUsuario } = await seedUsuarios({ ...ctx, personas }, 3);

    // 3) Trabajadores solo para personas tipo 'trabajador'
    const trabajadores = await seedTrabajadores(
      { ...ctx, personasTrabajadorIds, mapPersonaToUsuario },
      0.45 // ~45% conductores
    );

    // 4) Autobuses con conductores válidos
    const conductores = trabajadores.filter(t => t.puesto === 'conductor');
    const autobuses = await seedAutobuses({ ...ctx, conductores }, 100);

    // 5) Rutas, horarios y boletos
    const rutas = await seedRutas({ ...ctx, autobuses }, 80);
    const horarios = await seedHorarios({ ...ctx, rutas }, 5);


    await seedBoletos({ ...ctx, usuarios, rutas, autobuses, horarios }, 50, 100);

    console.log('✅ Seed completo');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  }
};

run();
