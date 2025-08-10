// seeders/horarioSeeder.js
import { DIAS, randHora, addMinutesHHMMSS, randomFrom } from './helpers.js';

export const seedHorarios = async ({ models, rutas }, porRuta = 3) => {
  const { Horario } = models;
  const horarios = [];

  for (const ruta of rutas) {
    const diasRuta = [...DIAS].sort(() => Math.random() - 0.5).slice(0, Math.max(3, Math.floor(Math.random() * 6)));
    for (let i = 0; i < porRuta; i++) {
      const salida = randHora(5, 21);
      const llegada = addMinutesHHMMSS(salida, Math.floor(ruta.tiempo_estimado_seg / 60) + (i * 5));
      const cap = Math.max(20, Math.floor(Math.random() * 40) + 20);

      const h = await Horario.create({
        rutaId: ruta.id,
        hora_salida: salida,     // TIME
        hora_llegada: llegada,   // TIME
        dias_disponibles: diasRuta.slice(0, Math.max(2, Math.floor(Math.random() * diasRuta.length))),
        capacidad_disponible: cap,
      });
      horarios.push(h);
    }
  }

  console.log(`⏰ Horarios creados: ${horarios.length}`);
  return horarios;
};
