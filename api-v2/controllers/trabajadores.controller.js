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

    // 🔹 Paginación segura
    const limit = Math.min(parseInt(req.query.limit ?? "50", 10) || 50, 200);
    const page = Math.max(parseInt(req.query.page ?? "1", 10) || 1, 1);
    const offset = (page - 1) * limit;

    const where = {};
    if (puesto) where.puesto = puesto;
    if (turno) where.turno = turno;

    const { count, rows } = await Trabajador.findAndCountAll({
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

    res.json({
      success: true,
      page,
      pages: Math.ceil(count / limit),
      total: count,
      limit,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
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
