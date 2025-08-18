import Trabajador from '../models/trabajador.js';
import Usuario from '../models/usuario.js';
import { Op } from 'sequelize';

/**
 * Obtener todos los trabajadores con filtros
 */
export const getAllTrabajadores = async (req, res) => {
  try {
    const { puesto, turno } = req.query;
    
    const where = {};
    if (puesto) where.puesto = puesto;
    if (turno) where.turno = turno;

    const trabajadores = await Trabajador.findAll({
      where,
      include: [
        {
          association: 'usuario',
          attributes: ['id', 'correo_electronico', 'estado'],
          include: ['persona']
        }
      ],
      order: [['fecha_ingreso', 'DESC']]
    });

    res.json({
      success: true,
      count: trabajadores.length,
      data: trabajadores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener trabajadores',
      error: error.message
    });
  }
};

/**
 * Obtener un trabajador por ID
 */
export const getTrabajadorById = async (req, res) => {
  try {
    const trabajador = await Trabajador.findByPk(req.params.id, {
      include: [
        {
          association: 'usuario',
          include: ['persona']
        }
      ]
    });

    if (!trabajador) {
      return res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
    }

    res.json({
      success: true,
      data: trabajador
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener trabajador',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo trabajador
 */
export const createTrabajador = async (req, res) => {
  try {
    // Validar usuario único si se proporciona
    if (req.body.usuarioId) {
      const exists = await Trabajador.findOne({ 
        where: { usuarioId: req.body.usuarioId }
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya está asignado a otro trabajador'
        });
      }

      // Verificar que el usuario existe
      const usuario = await Usuario.findByPk(req.body.usuarioId);
      if (!usuario) {
        return res.status(400).json({
          success: false,
          message: 'El usuario especificado no existe'
        });
      }
    }

    const trabajador = await Trabajador.create(req.body);

    res.status(201).json({
      success: true,
      data: trabajador
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear trabajador',
      error: error.message
    });
  }
};

/**
 * Actualizar un trabajador existente
 */
export const updateTrabajador = async (req, res) => {
  try {
    const trabajador = await Trabajador.findByPk(req.params.id);
    if (!trabajador) {
      return res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
    }

    // Validar usuario único si se está actualizando
    if (req.body.usuarioId && req.body.usuarioId !== trabajador.usuarioId) {
      const exists = await Trabajador.findOne({ 
        where: { usuarioId: req.body.usuarioId }
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya está asignado a otro trabajador'
        });
      }

      // Verificar que el usuario existe
      const usuario = await Usuario.findByPk(req.body.usuarioId);
      if (!usuario) {
        return res.status(400).json({
          success: false,
          message: 'El usuario especificado no existe'
        });
      }
    }

    await trabajador.update(req.body);

    res.json({
      success: true,
      data: trabajador
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar trabajador',
      error: error.message
    });
  }
};

/**
 * Eliminar un trabajador
 */
export const deleteTrabajador = async (req, res) => {
  try {
    const trabajador = await Trabajador.findByPk(req.params.id);
    if (!trabajador) {
      return res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
    }

    await trabajador.destroy();

    res.json({
      success: true,
      message: 'Trabajador eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar trabajador',
      error: error.message
    });
  }
};

/**
 * Buscar trabajadores por puesto
 */
export const getTrabajadoresByPuesto = async (req, res) => {
  try {
    const { puesto } = req.params;
    
    if (!['conductor', 'supervisor', 'mantenimiento', 'administrativo'].includes(puesto)) {
      return res.status(400).json({
        success: false,
        message: 'Puesto no válido'
      });
    }

    const trabajadores = await Trabajador.findAll({
      where: { puesto },
      include: [
        {
          association: 'usuario',
          attributes: ['id', 'correo_electronico'],
          include: ['persona']
        }
      ]
    });

    res.json({
      success: true,
      count: trabajadores.length,
      data: trabajadores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener trabajadores por puesto',
      error: error.message
    });
  }
};