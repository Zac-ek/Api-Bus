import Autobus from '../models/autobus.js';
import { Op } from 'sequelize';

/**
 * @description Obtener todos los autobuses
 * @route GET /api/autobuses
 * @access Public
 */
export const getAllAutobuses = async (req, res) => {
  try {
    const { estado, modelo } = req.query;
    
    // Filtros
    const where = {};
    if (estado) where.estado = estado;
    if (modelo) where.modelo = { [Op.like]: `%${modelo}%` };

    const autobuses = await Autobus.findAll({
      where,
      include: [
        {
          association: 'conductor',
          attributes: ['id', 'puesto', 'turno']
        }
      ],
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: autobuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener autobuses',
      error: error.message
    });
  }
};

/**
 * @description Obtener un autobús por ID
 * @route GET /api/autobuses/:id
 * @access Public
 */
export const getAutobusById = async (req, res) => {
  try {
    const { id } = req.params;
    const autobus = await Autobus.findByPk(id, {
      include: [
        {
          association: 'conductor',
          attributes: ['id', 'puesto', 'turno']
        }
      ]
    });

    if (!autobus) {
      return res.status(404).json({
        success: false,
        message: 'Autobús no encontrado'
      });
    }

    res.json({
      success: true,
      data: autobus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener autobús',
      error: error.message
    });
  }
};

/**
 * @description Crear un nuevo autobús
 * @route POST /api/autobuses
 * @access Private/Admin
 */
export const createAutobus = async (req, res) => {
  try {
    const { placa, modelo, anio, capacidad, estado, conductorId } = req.body;

    // Validar placa única
    if (placa) {
      const exists = await Autobus.findOne({ where: { placa } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'La placa ya está registrada'
        });
      }
    }

    const autobus = await Autobus.create({
      placa,
      modelo,
      anio,
      capacidad,
      estado,
      conductorId
    });

    res.status(201).json({
      success: true,
      data: autobus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear autobús',
      error: error.message
    });
  }
};

/**
 * @description Actualizar un autobús
 * @route PUT /api/autobuses/:id
 * @access Private/Admin
 */
export const updateAutobus = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, modelo, anio, capacidad, estado, conductorId } = req.body;

    const autobus = await Autobus.findByPk(id);
    if (!autobus) {
      return res.status(404).json({
        success: false,
        message: 'Autobús no encontrado'
      });
    }

    // Validar placa única (si se está actualizando)
    if (placa && placa !== autobus.placa) {
      const exists = await Autobus.findOne({ where: { placa } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'La placa ya está registrada'
        });
      }
    }

    await autobus.update({
      placa,
      modelo,
      anio,
      capacidad,
      estado,
      conductorId
    });

    res.json({
      success: true,
      data: autobus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar autobús',
      error: error.message
    });
  }
};

/**
 * @description Eliminar un autobús
 * @route DELETE /api/autobuses/:id
 * @access Private/Admin
 */
export const deleteAutobus = async (req, res) => {
  try {
    const { id } = req.params;
    const autobus = await Autobus.findByPk(id);

    if (!autobus) {
      return res.status(404).json({
        success: false,
        message: 'Autobús no encontrado'
      });
    }

    await autobus.destroy();

    res.json({
      success: true,
      message: 'Autobús eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar autobús',
      error: error.message
    });
  }
};

/**
 * @description Obtener autobuses por estado
 * @route GET /api/autobuses/estado/:estado
 * @access Public
 */
export const getAutobusesByEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    
    if (!['activo', 'mantenimiento', 'fuera_servicio'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    const autobuses = await Autobus.findAll({
      where: { estado },
      include: [
        {
          association: 'conductor',
          attributes: ['id', 'puesto', 'turno']
        }
      ]
    });

    res.json({
      success: true,
      data: autobuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener autobuses por estado',
      error: error.message
    });
  }
};