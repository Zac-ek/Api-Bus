// controllers/rutas.controller.js
import sequelize from "../config/db.js";
import Ruta from '../models/ruta.js';
import { Op } from 'sequelize';

/**
 * @description Obtener todas las rutas con filtros
 */
export const getAllRutas = async (req, res) => {
  try {
    const { activo, punto_inicio, punto_final } = req.query;
    
    const where = {};
    if (activo !== undefined) where.activo = activo === 'true';
    if (punto_inicio) where.punto_inicio = { [Op.like]: `%${punto_inicio}%` };
    if (punto_final) where.punto_final = { [Op.like]: `%${punto_final}%` };

    const rutas = await Ruta.findAll({
      where,
      include: ['autobus_asignado', 'horarios'],
      order: [['punto_inicio', 'ASC'], ['punto_final', 'ASC']]
    });

    res.json({
      success: true,
      count: rutas.length,
      data: rutas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener rutas',
      error: error.message
    });
  }
};

/**
 * @description Obtener una ruta por ID
 */
export const getRutaById = async (req, res) => {
  try {
    const ruta = await Ruta.findByPk(req.params.id, {
      include: ['autobus_asignado', 'horarios']
    });

    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    res.json({
      success: true,
      data: ruta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ruta',
      error: error.message
    });
  }
};

/**
 * @description Crear una nueva ruta
 */
export const createRuta = async (req, res) => {
  try {
    // Validar puntos diferentes
    if (req.body.punto_inicio === req.body.punto_final) {
      return res.status(400).json({
        success: false,
        message: 'El origen y destino no pueden ser iguales'
      });
    }

    const ruta = await Ruta.create(req.body);

    res.status(201).json({
      success: true,
      data: ruta
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear ruta',
      error: error.message
    });
  }
};

/**
 * @description Actualizar una ruta existente
 */
export const updateRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findByPk(req.params.id);
    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    // Validar puntos diferentes si se están actualizando
    if (req.body.punto_inicio && req.body.punto_final && 
        req.body.punto_inicio === req.body.punto_final) {
      return res.status(400).json({
        success: false,
        message: 'El origen y destino no pueden ser iguales'
      });
    }

    await ruta.update(req.body);

    res.json({
      success: true,
      data: ruta
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar ruta',
      error: error.message
    });
  }
};

/**
 * @description Cambiar estado de una ruta (activar/desactivar)
 */
export const changeRutaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const ruta = await Ruta.findByPk(id);
    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    await ruta.update({ activo });

    res.json({
      success: true,
      message: `Ruta ${activo ? 'activada' : 'desactivada'} correctamente`,
      data: ruta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado de la ruta',
      error: error.message
    });
  }
};

/**
 * @description Eliminar una ruta
 */
export const deleteRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findByPk(req.params.id, {
      include: ['horarios']
    });

    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
      });
    }

    // Verificar si tiene horarios asociados
    if (ruta.horarios && ruta.horarios.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar, la ruta tiene horarios asociados'
      });
    }

    await ruta.destroy();

    res.json({
      success: true,
      message: 'Ruta eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ruta',
      error: error.message
    });
  }
};

export async function listOrigins(req, res) {
  try {
    const [rows] = await sequelize.query(
      "SELECT DISTINCT punto_inicio AS nombre FROM Rutas WHERE activo=1 ORDER BY nombre"
    );
    res.json(rows.map((r) => r.nombre));
  } catch (e) {
    console.error("Error listOrigins:", e);
    res.status(500).json({ message: "Error obteniendo orígenes" });
  }
}

export async function listDestinations(req, res) {
  try {
    const { origen } = req.query;
    if (!origen) return res.status(400).json({ message: "origen requerido" });

    const [rows] = await sequelize.query(
      "SELECT DISTINCT punto_final AS nombre FROM Rutas WHERE activo=1 AND punto_inicio = ? ORDER BY nombre",
      { replacements: [origen] }
    );
    res.json(rows.map((r) => r.nombre));
  } catch (e) {
    console.error("Error listDestinations:", e);
    res.status(500).json({ message: "Error obteniendo destinos" });
  }
}
