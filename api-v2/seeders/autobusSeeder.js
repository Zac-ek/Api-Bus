// seeders/boletoSeeder.js
import { faker } from '@faker-js/faker';
import { randDateWithin } from './helpers.js';

const ESTADO = ['reservado', 'cancelado', 'completado'];
const ESTADOS_BUS_PERMITIDOS = new Set(['activo']); // <- solo estos pueden recibir boletos

export const seedBoletos = async (
  { models, usuarios, rutas, autobuses, horarios },
  maxPorUsuario = 5, // máximo boletos por usuario
  nulosCada = 100    // cada N boletos: fecha_reservacion y asiento_numero = null
) => {
  const { Boleto } = models;
  const boletos = [];

  // Mapa rápido de autobuses por id
  const busById = new Map(autobuses.map(b => [b.id, b]));

  // Para respetar índice único: (autobus_id, fecha_viaje, asiento_numero, horario_id)
  const ocupacion = new Map(); // key: `${autobusId}|${fechaISO}|${horarioId}` -> Set(asientos)

  const pickAsientoLibre = (autobusId, fechaISO, horarioId, capMax = 52) => {
    const key = `${autobusId}|${fechaISO}|${horarioId}`;
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
      // Intentar encontrar un horario cuya ruta use un BUS ACTIVO
      let h = null;
      let ruta = null;
      let autobus = null;

      const MAX_INTENTOS = 12;
      for (let intento = 0; intento < MAX_INTENTOS; intento++) {
        const cand = horarios[faker.number.int({ min: 0, max: horarios.length - 1 })];
        const r = rutas.find(rr => rr.id === cand.rutaId);
        if (!r) continue;

        const bus = busById.get(r.autobus_asignadoId);
        if (!bus) continue;

        // Solo aceptar autobuses activos
        if (!ESTADOS_BUS_PERMITIDOS.has(bus.estado)) continue;

        // Elegido
        h = cand; ruta = r; autobus = bus;
        break;
      }

      // Si no se encontró un horario con bus activo, saltamos este boleto
      if (!h || !ruta || !autobus) continue;

      const fechaViaje = randDateWithin(45);
      const fechaISO = new Date(fechaViaje).toISOString().slice(0, 10); // YYYY-MM-DD

      // ¿Este boleto es múltiplo de nulosCada? (100, 200, 300, …)
      const esNulo = ((boletos.length + 1) % nulosCada === 0);

      let asiento = null;
      if (!esNulo) {
        asiento = pickAsientoLibre(autobus.id, fechaISO, h.id, autobus.capacidad || 52);
        if (!asiento) continue; // ese viaje/horario ya está lleno; probar siguiente boleto
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

  console.log(`🎟️ Boletos creados: ${boletos.length} (solo en buses ACTIVO; cada ${nulosCada}° con campos nulos)`);
  return boletos;
};
