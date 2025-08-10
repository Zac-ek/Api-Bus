import express from 'express';
import {
    createPersona,
    deletePersona,
    getAllPersonas,
    getPersonaById,
    updatePersona
} from '../controllers/persona.js';

const router = express.Router();

// CRUD routes
router.get('/', getAllPersonas);
router.get('/:id', getPersonaById);
router.post('/', createPersona);
router.put('/:id', updatePersona);
router.delete('/:id', deletePersona);

export default router;