import Horario from '../models/horario.js';
import { Op } from 'sequelize';

/**
 * @description Obtener todos los horarios
 */
export const getAllHorarios = async (req, res) => {
  try {
    const { rutaId, dia } = req.query;
    
    const where = {};
    if (rutaId) where.rutaId = rutaId;
    
    // Filtrar por día si se especifica
    if (dia) {
      where.dias_disponibles = {
        [Op.contains]: [dia]
      };
    }

    const horarios = await Horario.findAll({
      where,
      include: ['ruta'],
      order: [['hora_salida', 'ASC']]
    });

    res.json({
      success: true,
      count: horarios.length,
      data: horarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener horarios',
      error: error.message
    });
  }
};

/**
 * @description Obtener un horario por ID
 */
export const getHorarioById = async (req, res) => {
  try {
    const horario = await Horario.findByPk(req.params.id, {
      include: ['ruta']
    });

    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    res.json({
      success: true,
      data: horario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener horario',
      error: error.message
    });
  }
};

/**
 * @description Crear un nuevo horario
 */
export const createHorario = async (req, res) => {
  try {
    const { rutaId, hora_salida, hora_llegada, dias_disponibles, capacidad_disponible } = req.body;

    // Validar formato de días disponibles
    let diasArray = [];
    if (dias_disponibles) {
      try {
        diasArray = Array.isArray(dias_disponibles) ? dias_disponibles : JSON.parse(dias_disponibles);
        if (!Array.isArray(diasArray)) {
          throw new Error('Formato inválido');
        }
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'dias_disponibles debe ser un array válido (ej. ["Lunes", "Martes"])'
        });
      }
    }

    const horario = await Horario.create({
      rutaId,
      hora_salida,
      hora_llegada,
      dias_disponibles: diasArray,
      capacidad_disponible
    });

    res.status(201).json({
      success: true,
      data: horario
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear horario',
      error: error.message
    });
  }
};

/**
 * @description Actualizar un horario existente
 */
export const updateHorario = async (req, res) => {
  try {
    const horario = await Horario.findByPk(req.params.id);
    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    const { dias_disponibles, ...updateData } = req.body;

    // Procesar días disponibles si se envían
    if (dias_disponibles !== undefined) {
      try {
        const diasArray = Array.isArray(dias_disponibles) ? 
          dias_disponibles : 
          JSON.parse(dias_disponibles);
        
        if (!Array.isArray(diasArray)) {
          throw new Error('Formato inválido');
        }
        updateData.dias_disponibles = diasArray;
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'dias_disponibles debe ser un array válido (ej. ["Lunes", "Martes"])'
        });
      }
    }

    await horario.update(updateData);

    res.json({
      success: true,
      data: horario
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar horario',
      error: error.message
    });
  }
};

/**
 * @description Eliminar un horario
 */
export const deleteHorario = async (req, res) => {
  try {
    const horario = await Horario.findByPk(req.params.id);
    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    await horario.destroy();

    res.json({
      success: true,
      message: 'Horario eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar horario',
      error: error.message
    });
  }
};

/**
 * @description Obtener horarios por ruta
 */
export const getHorariosByRuta = async (req, res) => {
  try {
    const { rutaId } = req.params;
    const { dia } = req.query;

    const where = { rutaId };
    if (dia) {
      where.dias_disponibles = {
        [Op.contains]: [dia]
      };
    }

    const horarios = await Horario.findAll({
      where,
      order: [['hora_salida', 'ASC']]
    });

    res.json({
      success: true,
      count: horarios.length,
      data: horarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener horarios por ruta',
      error: error.message
    });
  }
};