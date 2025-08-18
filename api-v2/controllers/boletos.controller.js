import Boleto from '../models/boleto.js';
import { Op } from 'sequelize';

/**
 * @description Obtener todos los boletos con filtros opcionales
 */
export const getAllBoletos = async (req, res) => {
  try {
    const { estado, fechaDesde, fechaHasta, usuarioId } = req.query;
    
    const where = {};
    if (estado) where.estado = estado;
    if (usuarioId) where.usuarioId = usuarioId;
    
    if (fechaDesde || fechaHasta) {
      where.fecha_viaje = {};
      if (fechaDesde) where.fecha_viaje[Op.gte] = fechaDesde;
      if (fechaHasta) where.fecha_viaje[Op.lte] = fechaHasta;
    }

    const boletos = await Boleto.findAll({
      where,
      include: ['usuario', 'ruta', 'autobus', 'horario'],
      order: [['fecha_viaje', 'DESC'], ['fecha_reservacion', 'DESC']]
    });

    res.json({
      success: true,
      count: boletos.length,
      data: boletos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener boletos',
      error: error.message
    });
  }
};

/**
 * @description Obtener un boleto por ID
 */
export const getBoletoById = async (req, res) => {
  try {
    const boleto = await Boleto.findByPk(req.params.id, {
      include: ['usuario', 'ruta', 'autobus', 'horario']
    });

    if (!boleto) {
      return res.status(404).json({
        success: false,
        message: 'Boleto no encontrado'
      });
    }

    res.json({
      success: true,
      data: boleto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener boleto',
      error: error.message
    });
  }
};

/**
 * @description Crear un nuevo boleto
 */
export const createBoleto = async (req, res) => {
  try {
    const { autobusId, fecha_viaje, asiento_numero, horarioId } = req.body;
    
    // Validar asiento único
    const exists = await Boleto.findOne({ 
      where: { 
        autobusId,
        fecha_viaje,
        asiento_numero,
        horarioId
      }
    });
    
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'El asiento ya está ocupado para este viaje'
      });
    }

    const boleto = await Boleto.create(req.body);

    res.status(201).json({
      success: true,
      data: boleto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear boleto',
      error: error.message
    });
  }
};

/**
 * @description Actualizar un boleto existente
 */
export const updateBoleto = async (req, res) => {
  try {
    const boleto = await Boleto.findByPk(req.params.id);
    
    if (!boleto) {
      return res.status(404).json({
        success: false,
        message: 'Boleto no encontrado'
      });
    }

    // Validar cambio de estado (ejemplo: no permitir cambiar de cancelado a reservado)
    if (req.body.estado && boleto.estado === 'cancelado' && req.body.estado === 'reservado') {
      return res.status(400).json({
        success: false,
        message: 'No se puede reactivar un boleto cancelado'
      });
    }

    await boleto.update(req.body);

    res.json({
      success: true,
      data: boleto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar boleto',
      error: error.message
    });
  }
};

/**
 * @description Cancelar un boleto (cambiar estado a cancelado)
 */
export const cancelBoleto = async (req, res) => {
  try {
    const boleto = await Boleto.findByPk(req.params.id);
    
    if (!boleto) {
      return res.status(404).json({
        success: false,
        message: 'Boleto no encontrado'
      });
    }

    if (boleto.estado === 'cancelado') {
      return res.status(400).json({
        success: false,
        message: 'El boleto ya está cancelado'
      });
    }

    await boleto.update({ estado: 'cancelado' });

    res.json({
      success: true,
      message: 'Boleto cancelado exitosamente',
      data: boleto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar boleto',
      error: error.message
    });
  }
};

/**
 * @description Eliminar un boleto (solo administradores)
 */
export const deleteBoleto = async (req, res) => {
  try {
    const boleto = await Boleto.findByPk(req.params.id);
    
    if (!boleto) {
      return res.status(404).json({
        success: false,
        message: 'Boleto no encontrado'
      });
    }

    await boleto.destroy();

    res.json({
      success: true,
      message: 'Boleto eliminado permanentemente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar boleto',
      error: error.message
    });
  }
};