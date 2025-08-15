import { fn, col, where } from 'sequelize';
import sequelize from '../config/db.js';
import Ruta from '../models/ruta.js';
import Horario from '../models/Horario.js'; // Asegúrate de tener este modelo

// GET /api/trips?origen=..&destino=..&fecha=YYYY-MM-DD
export async function searchTrips(req, res) {
  try {
    const { origen, destino, fecha } = req.query;
    if (!origen || !destino || !fecha) {
      return res.status(400).json({ message: 'origen, destino y fecha son requeridos' });
    }

    const rutas = await Ruta.findAll({
      where: { punto_inicio: origen, punto_final: destino, activo: true },
      attributes: ['id', 'nombre', 'punto_inicio', 'punto_final', 'distancia_km', 'tiempo_estimado_seg', 'autobus_asignadoId'],
      include: [{
        model: Horario,
        as: 'horarios',                               // ¡IMPORTANTE usar el alias correcto!
        attributes: ['id', 'salida', 'llegada', 'precio', 'asientos_disponibles', 'clase'],
        where: where(fn('DATE', col('horarios.salida')), fecha), // DATE(horarios.salida) = fecha
        required: true
      }],
      order: [[{ model: Horario, as: 'horarios' }, 'salida', 'ASC']]
    });

    // aplanar a "trips"
    const trips = rutas.flatMap(r => r.horarios.map(h => ({
      id: `${r.id}-${h.id}`,
      rutaId: r.id,
      origen: r.punto_inicio,
      destino: r.punto_final,
      salida: h.salida,
      llegada: h.llegada,
      precio: Number(h.precio),
      asientosDisponibles: h.asientos_disponibles,
      empresa: r.nombre || 'ByteBuss',
      clase: h.clase || 'Económica'
    })));

    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar viajes' });
  }
}

// GET /api/rutas/ciudades  -> llena autocompletado del Home
export async function listCities(_req, res) {
  const [origins] = await sequelize.query(
    "SELECT DISTINCT punto_inicio AS nombre FROM Rutas WHERE activo=1 ORDER BY nombre"
  );
  const [destinations] = await sequelize.query(
    "SELECT DISTINCT punto_final AS nombre FROM Rutas WHERE activo=1 ORDER BY nombre"
  );
  res.json({
    origins: origins.map(x => x.nombre),
    destinations: destinations.map(x => x.nombre)
  });
}
