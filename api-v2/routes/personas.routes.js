import express from 'express';
import {
  getAllPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona,
  searchPersonas
} from '../controllers/personas.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllPersonas);
router.post('/', createPersona);

// Rutas protegidas (requieren autenticación y rol de admin)
router.get('/search', authenticate, authorize(['admin']), searchPersonas);
router.get('/:id', authenticate, authorize(['admin']), getPersonaById);
router.put('/:id', authenticate, authorize(['admin']), updatePersona);
router.delete('/:id', authenticate, authorize(['admin']), deletePersona);

export default router;