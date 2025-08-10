// seeders/boletoSeeder.js
import { faker } from '@faker-js/faker';
import { randDateWithin } from './helpers.js';

const ESTADO = ['reservado', 'cancelado', 'completado'];

export const seedBoletos = async ({ models, usuarios, rutas, autobuses, horarios }, maxPorUsuario = 3) => {
  const { Boleto } = models;
  const boletos = [];

  // Para respetar índice único: (autobus_id, fecha_viaje, asiento_numero, horario_id)
  const ocupacion = new Map(); // key: `${autobusId}|${fecha}|${horarioId}` -> Set(asientos)

  const pickAsientoLibre = (autobusId, fecha, horarioId, capMax = 52) => {
    const key = `${autobusId}|${fecha}|${horarioId}`;
    if (!ocupacion.has(key)) ocupacion.set(key, new Set());
    const usados = ocupacion.get(key);

    // Limitar intentos por si se llena
    for (let i = 0; i < capMax * 2; i++) {
      const asiento = faker.number.int({ min: 1, max: capMax });
      if (!usados.has(asiento)) {
        usados.add(asiento);
        return asiento;
      }
    }
    return null; // lleno
  };

  for (const u of usuarios) {
    const cuantas = faker.number.int({ min: 1, max: maxPorUsuario });
    for (let k = 0; k < cuantas; k++) {
      // Tomar horario y derivar ruta/autobús consistentes
      const h = horarios[faker.number.int({ min: 0, max: horarios.length - 1 })];
      const ruta = rutas.find(r => r.id === h.rutaId);
      const autobus = autobuses.find(a => a.id === ruta.autobus_asignadoId);

      const fechaViaje = randDateWithin(45);
      const asiento = pickAsientoLibre(autobus.id, fechaViaje, h.id, autobus.capacidad || 52);
      if (!asiento) continue;

      const precio = Number(ruta.distancia_km) * 1.2 + 50; // ejemplo sencillo

      const b = await Boleto.create({
        usuarioId: u.id,
        rutaId: ruta.id,
        autobusId: autobus.id,
        horarioId: h.id,
        fecha_reservacion: new Date(),
        fecha_viaje: fechaViaje,
        asiento_numero: asiento,
        estado: ESTADO[k % ESTADO.length],
        precio: precio.toFixed(2),
      });
      boletos.push(b);
    }
  }

  console.log(`🎟️ Boletos creados: ${boletos.length}`);
  return boletos;
};
