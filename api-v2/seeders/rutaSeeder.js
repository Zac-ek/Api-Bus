// seeders/rutaSeeder.js
import { faker } from '@faker-js/faker';

export const seedRutas = async ({ models, autobuses }, cantidad = 28) => {
  const { Ruta } = models;
  const rutas = [];

  for (let i = 0; i < cantidad; i++) {
    let a = faker.location.city();
    let b = faker.location.city();
    if (b === a) b = faker.location.city();

    const distancia = faker.number.float({ min: 5, max: 600, precision: 0.1 });
    const durMin = Math.max(20, Math.floor(distancia * faker.number.float({ min: 0.6, max: 1.5 })));
    const r = await Ruta.create({
      nombre: `${a} - ${b}`,
      punto_inicio: a,
      punto_final: b,
      distancia_km: distancia,
      tiempo_estimado_seg: durMin * 60, // tu modelo guarda en segundos
      autobus_asignadoId: autobuses[i % autobuses.length].id,
      activo: true,
    });
    rutas.push(r);
  }

  console.log(`🗺️ Rutas creadas: ${rutas.length}`);
  return rutas;
};
