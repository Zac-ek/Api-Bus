// seeders/trabajadorSeeder.js
import { faker } from '@faker-js/faker';

const PUESTO = ['conductor', 'supervisor', 'mantenimiento', 'administrativo'];
const TURNO = ['matutino', 'vespertino', 'nocturno', 'mixto'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const seedTrabajadores = async (
  { models, personasTrabajadorIds, mapPersonaToUsuario },
  porcentajeConductores = 0.6 // ~60% conductores por defecto
) => {
  const { Trabajador } = models;
  const trabajadores = [];

  if (!personasTrabajadorIds?.length) {
    console.log('👷 No hay personas marcadas como "trabajador"; no se crearon Trabajadores.');
    return trabajadores;
  }

  const total = personasTrabajadorIds.length;
  const minConductores = Math.max(4, Math.floor(total * porcentajeConductores));
  let contConductores = 0;

  for (let i = 0; i < total; i++) {
    const personaId = personasTrabajadorIds[i];
    const u = mapPersonaToUsuario.get(personaId);
    if (!u) continue; // seguridad: debe existir usuario para esa persona

    const puesto = contConductores < minConductores ? 'conductor' : pick(PUESTO);
    if (puesto === 'conductor') contConductores++;

    const t = await Trabajador.create({
      usuarioId: u.id,               // 🔗 enlazado al usuario de esa persona
      puesto,
      turno: pick(TURNO),
      fecha_ingreso: faker.date.past({ years: 5 }),
    });

    trabajadores.push(t);
  }

  console.log(`👷 Trabajadores: ${trabajadores.length} (conductores: ${contConductores})`);
  return trabajadores;
};
