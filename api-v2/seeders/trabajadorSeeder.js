// seeders/trabajadorSeeder.js
import { faker } from '@faker-js/faker';

const PUESTO = ['conductor', 'supervisor', 'mantenimiento', 'administrativo'];
const TURNO = ['matutino', 'vespertino', 'nocturno', 'mixto'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const seedTrabajadores = async ({ models, usuarios }, porcentajeTrabajadores = 0.5) => {
  const { Trabajador } = models;
  const trabajadores = [];

  const total = Math.max(5, Math.floor(usuarios.length * porcentajeTrabajadores));
  const indices = Array.from({ length: usuarios.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, total);

  // Asegurar suficientes conductores
  const minConductores = Math.max(4, Math.floor(total * 0.4));
  let contConductores = 0;

  for (let k = 0; k < indices.length; k++) {
    const idx = indices[k];
    const puesto = contConductores < minConductores ? 'conductor' : randomFrom(PUESTO);
    if (puesto === 'conductor') contConductores++;

    const t = await Trabajador.create({
      usuarioId: usuarios[idx].id,
      puesto,
      turno: randomFrom(TURNO),
      fecha_ingreso: faker.date.past({ years: 5 }),
    });
    trabajadores.push(t);
  }

  console.log(`👷 Trabajadores: ${trabajadores.length} (conductores: ${contConductores})`);
  return trabajadores;
};
