// seeders/boletoSeeder.js
import { faker } from '@faker-js/faker';
import { randDateWithin } from './helpers.js';

const ESTADO = ['reservado', 'cancelado', 'completado'];

// Trae el nombre real desde Persona asociada a Usuario
async function getNombrePersona(models, usuarioId) {
  const usuario = await models.Usuario.findByPk(usuarioId, {
    include: [{ model: models.Persona, as: 'persona' }],
  });
  if (!usuario || !usuario.persona) return `Usuario ${usuarioId}`;
  const p = usuario.persona;
  return [p.nombre, p.primer_apellido, p.segundo_apellido].filter(Boolean).join(' ').trim();
}

export const seedBoletos = async (
  { models, usuarios, rutas, autobuses, horarios },
  maxPorUsuario = 3,      // 👈 tope por usuario
  nulosCada = 100,        // cada N, fecha_reservacion/asiento_numero = null
  boletosTotales = Math.max(usuarios.length * 2, 50) 
) => {
  const { Boleto } = models;
  const boletos = [];

  // índice único: (autobus_id, fecha_viaje, asiento_numero, horario_id)
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

  // Conteo por usuario para no pasar el tope
  const conteoPorUsuario = new Map(usuarios.map(u => [u.id, 0]));
  const usuariosElegibles = () => usuarios.filter(u => (conteoPorUsuario.get(u.id) ?? 0) < maxPorUsuario);

  let intentosSeguridad = boletosTotales * 10; // para evitar loops infinitos si se llena todo

  while (boletos.length < boletosTotales && intentosSeguridad-- > 0) {
    const elegibles = usuariosElegibles();
    if (elegibles.length === 0) break; // todos llegaron al tope

    // pick usuario aleatorio con cupo disponible
    const u = elegibles[faker.number.int({ min: 0, max: elegibles.length - 1 })];

    // pick horario, ruta, autobus coherentes
    const h = horarios[faker.number.int({ min: 0, max: horarios.length - 1 })];
    const ruta = rutas.find(r => r.id === h.rutaId);
    if (!ruta) continue;
    const autobus = autobuses.find(a => a.id === ruta.autobus_asignadoId);
    if (!autobus) continue;

    const fechaViaje = randDateWithin(45);
    const esNulo = ((boletos.length + 1) % nulosCada === 0);

    let asiento = null;
    if (!esNulo) {
      asiento = pickAsientoLibre(autobus.id, fechaViaje, h.id, autobus.capacidad || 52);
      if (!asiento) continue; // ese viaje/horario ya lleno, probamos otro loop
    }

    const precio = Number(ruta.distancia_km || 100) * 1.2 + 50;
    const nombreUsuario = await getNombrePersona(models, u.id);

    const b = await Boleto.create({
      usuarioId: u.id,
      nombre_usuario: nombreUsuario,
      rutaId: ruta.id,
      autobusId: autobus.id,
      horarioId: h.id,
      fecha_reservacion: esNulo ? null : new Date(),
      fecha_viaje: fechaViaje,
      asiento_numero: esNulo ? null : asiento,
      estado: ESTADO[boletos.length % ESTADO.length],
      precio: precio.toFixed(2),
    });

    // actualiza conteo y registra boleto
    conteoPorUsuario.set(u.id, (conteoPorUsuario.get(u.id) ?? 0) + 1);
    boletos.push(b);
  }

  console.log(
    `🎟️ Boletos creados: ${boletos.length} (maxPorUsuario=${maxPorUsuario}, boletosTotales objetivo=${boletosTotales})`
  );
  return boletos;
};
