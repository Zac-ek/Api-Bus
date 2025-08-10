import Persona from '../models/persona.js';

// CRUD operations
export const getAllPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPersonaById = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.json(persona);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPersona = async (req, res) => {
  try {
    const persona = await Persona.create(req.body);
    res.status(201).json(persona);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePersona = async (req, res) => {
  try {
    const [updated] = await Persona.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPersona = await Persona.findByPk(req.params.id);
      return res.json(updatedPersona);
    }
    throw new Error('Persona no encontrada');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePersona = async (req, res) => {
  try {
    const deleted = await Persona.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Persona eliminada' });
    }
    throw new Error('Persona no encontrada');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};