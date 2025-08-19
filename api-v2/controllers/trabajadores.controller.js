// controllers/trabajadores.controller.js
import sequelize from "../config/db.js";
// Obtén los modelos ya inicializados y asociados
const { Trabajador, Usuario, Persona } = sequelize.models;

/**
 * GET /api/trabajadores
 * Filtros: ?puesto=conductor&turno=matutino
 */
export const getAllTrabajadores = async (req, res) => {
  try {
    const { puesto, turno } = req.query;
    const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit ?? "50", 10), 1),
      200
    );
    const offset = (page - 1) * limit;

    const where = {};
    if (puesto) where.puesto = puesto;
    if (turno) where.turno = turno;

    const { rows, count } = await Trabajador.findAndCountAll({
      where,
      attributes: [
        "id",
        "puesto",
        "turno",
        "fecha_ingreso",
        "usuarioId",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "correo_electronico", "estado", "personaId"],
          include: [
            {
              model: Persona,
              as: "persona",
              attributes: [
                "nombre",
                "primer_apellido",
                "segundo_apellido",
                "documento_identidad",
                "tipo",
              ],
            },
          ],
        },
      ],
      order: [["fecha_ingreso", "DESC"]],
      limit,
      offset,
    });

    // 👉 IDs de choferes en esta página
    const ids = rows.map((r) => r.id);
    let statsById = new Map();

    if (ids.length) {
      // Query de stats (ajusta los nombres si difieren en tu esquema)
      const placeholders = ids.map(() => "?").join(",");
      const [stats] = await sequelize.query(
        `
        SELECT
          t.id AS chofer_id,
          /* en servicio hoy (cámbialo a tu regla) */
          EXISTS(
            SELECT 1
            FROM autobuses a
            JOIN rutas r   ON r.autobus_asignado_id = a.id
            JOIN horarios h ON h.ruta_id = r.id
            WHERE a.conductor_id = t.id
              AND h.hora_salida BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY)
          ) AS en_servicio,
          /* viajes del último mes */
          COUNT(DISTINCT h2.id) AS viajes_mes
        FROM trabajadores t
        LEFT JOIN autobuses a2 ON a2.conductor_id = t.id
        LEFT JOIN rutas r2     ON r2.autobus_asignado_id = a2.id
        LEFT JOIN horarios h2  ON h2.ruta_id = r2.id
          AND h2.hora_salida >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        WHERE t.id IN (${placeholders})
        GROUP BY t.id
      `,
        { replacements: ids }
      );

      statsById = new Map(stats.map((s) => [Number(s.chofer_id), s]));
    }

    // Mezcla filas + stats
    const data = rows.map((r) => {
      const s = statsById.get(Number(r.id));
      return {
        ...r.toJSON(),
        en_servicio: !!(s?.en_servicio ?? 0),
        viajes_mes: Number(s?.viajes_mes ?? 0),
      };
    });

    return res.json({
      success: true,
      page,
      pages: Math.ceil(count / limit),
      total: count,
      limit,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener trabajadores",
      error: error.message,
    });
  }
};

/**
 * GET /api/trabajadores/:id
 */
export const getTrabajadorById = async (req, res) => {
  try {
    const trabajador = await Trabajador.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          include: [
            {
              model: Persona,
              as: "persona",
              attributes: [
                "nombre",
                "primer_apellido",
                "segundo_apellido",
                "documento_identidad",
                "tipo",
              ],
              required: false,
            },
          ],
        },
      ],
    });

    if (!trabajador) {
      return res
        .status(404)
        .json({ success: false, message: "Trabajador no encontrado" });
    }

    res.json({ success: true, data: trabajador });
  } catch (error) {
    console.error("getTrabajadorById error:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener trabajador",
      error: error.message,
    });
  }
};

/**
 * GET /api/trabajadores/puesto/:puesto
 */
export const getTrabajadoresByPuesto = async (req, res) => {
  try {
    const { puesto } = req.params;

    if (
      !["conductor", "supervisor", "mantenimiento", "administrativo"].includes(
        puesto
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Puesto no válido" });
    }

    const trabajadores = await Trabajador.findAll({
      where: { puesto },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "correo_electronico", "estado", "personaId"],
          include: [
            {
              model: Persona,
              as: "persona",
              attributes: [
                "nombre",
                "primer_apellido",
                "segundo_apellido",
                "documento_identidad",
                "tipo",
              ],
              required: false,
            },
          ],
        },
      ],
    });

    res.json({ success: true, count: trabajadores.length, data: trabajadores });
  } catch (error) {
    console.error("getTrabajadoresByPuesto error:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener trabajadores por puesto",
      error: error.message,
    });
  }
};
