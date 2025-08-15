// seeders/boletoSeeder.js
import { faker } from '@faker-js/faker';
import { randDateWithin } from './helpers.js';

const ESTADO = ['reservado', 'cancelado', 'completado'];

export const seedBoletos = async (
  { models, usuarios, rutas, autobuses, horarios },
  maxPorUsuario = 5, // máximo boletos por usuario
  nulosCada = 100 // ← cada N boletos pondremos fecha_reservacion y asiento_numero en null
) => {
  const { Boleto } = models;
  const boletos = [];

  // Para respetar índice único: (autobus_id, fecha_viaje, asiento_numero, horario_id)
  const ocupacion = new Map(); // key: `${autobusId}|${fecha}|${horarioId}` -> Set(asientos)

  const pickAsientoLibre = (autobusId, fecha, horarioId, capMax = 52) => {
    const key = `${autobusId}|${fecha}|${horarioId}`;
    if (!ocupacion.has(key)) ocupacion.set(key, new Set());
    const usados = ocupacion.get(key);

    for (let i = 0; i < capMax * 2; i++) {
      const asiento = faker.number.int({ min: 1, max: capMax });
      if (!usados.has(asiento)) {
        usados.add(asiento);
        return asiento;
      }
    }
    return null;
  };

  for (const u of usuarios) {
    const cuantas = faker.number.int({ min: 1, max: maxPorUsuario });
    for (let k = 0; k < cuantas; k++) {
      const h = horarios[faker.number.int({ min: 0, max: horarios.length - 1 })];
      const ruta = rutas.find(r => r.id === h.rutaId);
      if (!ruta) continue;
      const autobus = autobuses.find(a => a.id === ruta.autobus_asignadoId);
      if (!autobus) continue;

      const fechaViaje = randDateWithin(45);

      // ¿Este boleto es múltiplo de nulosCada? (100, 200, 300, …)
      const esNulo = ((boletos.length + 1) % nulosCada === 0);

      let asiento = null;
      if (!esNulo) {
        asiento = pickAsientoLibre(autobus.id, fechaViaje, h.id, autobus.capacidad || 52);
        if (!asiento) continue; // ese viaje/horario ya lleno; probar siguiente
      }

      const precio = Number(ruta.distancia_km || 100) * 1.2 + 50;

      const b = await Boleto.create({
        usuarioId: u.id,
        rutaId: ruta.id,
        autobusId: autobus.id,
        horarioId: h.id,
        fecha_reservacion: esNulo ? null : new Date(),
        fecha_viaje: fechaViaje,
        asiento_numero: esNulo ? null : asiento,
        estado: ESTADO[k % ESTADO.length],
        precio: precio.toFixed(2),
      });
      boletos.push(b);
    }
  }

  console.log(`🎟️ Boletos creados: ${boletos.length} (cada ${nulosCada}° con fecha_reservacion/asiento_numero = null)`);
  return boletos;
};
