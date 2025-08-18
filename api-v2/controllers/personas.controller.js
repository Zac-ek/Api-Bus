import Persona from '../models/persona.js';
import { Op } from 'sequelize';

/**
 * Obtener todas las personas con filtros opcionales
 */
export const getAllPersonas = async (req, res) => {
  try {
    const { tipo, genero, documento } = req.query;
    
    const where = {};
    if (tipo) where.tipo = tipo;
    if (genero) where.genero = genero;
    if (documento) where.documento_identidad = { [Op.like]: `%${documento}%` };

    const personas = await Persona.findAll({
      where,
      order: [['primer_apellido', 'ASC'], ['nombre', 'ASC']]
    });

    res.json({
      success: true,
      count: personas.length,
      data: personas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener personas',
      error: error.message
    });
  }
};

/**
 * Obtener una persona por ID
 */
export const getPersonaById = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id, {
      include: ['usuario'] // Incluir datos de usuario asociado
    });

    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    res.json({
      success: true,
      data: persona
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener persona',
      error: error.message
    });
  }
};

/**
 * Crear una nueva persona
 */
export const createPersona = async (req, res) => {
  try {
    // Validar documento único si se proporciona
    if (req.body.documento_identidad) {
      const exists = await Persona.findOne({ 
        where: { documento_identidad: req.body.documento_identidad }
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'El documento de identidad ya está registrado'
        });
      }
    }

    const persona = await Persona.create(req.body);

    res.status(201).json({
      success: true,
      data: persona
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear persona',
      error: error.message
    });
  }
};

/**
 * Actualizar una persona existente
 */
export const updatePersona = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    // Validar documento único si se está actualizando
    if (req.body.documento_identidad && 
        req.body.documento_identidad !== persona.documento_identidad) {
      const exists = await Persona.findOne({ 
        where: { documento_identidad: req.body.documento_identidad }
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'El documento de identidad ya está registrado'
        });
      }
    }

    await persona.update(req.body);

    res.json({
      success: true,
      data: persona
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar persona',
      error: error.message
    });
  }
};

/**
 * Eliminar una persona
 */
export const deletePersona = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    // Verificar si tiene usuario asociado
    const usuario = await persona.getUsuario();
    if (usuario) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar, la persona tiene un usuario asociado'
      });
    }

    await persona.destroy();

    res.json({
      success: true,
      message: 'Persona eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar persona',
      error: error.message
    });
  }
};

/**
 * Buscar personas por nombre o apellido
 */
export const searchPersonas = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'La búsqueda debe tener al menos 3 caracteres'
      });
    }

    const personas = await Persona.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { primer_apellido: { [Op.like]: `%${query}%` } },
          { segundo_apellido: { [Op.like]: `%${query}%` } }
        ]
      },
      limit: 50
    });

    res.json({
      success: true,
      count: personas.length,
      data: personas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
};