import express from 'express';
import {
  getAllHorarios,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario,
  getHorariosByRuta
} from '../controllers/horarios.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllHorarios);
router.get('/:id', getHorarioById);
router.get('/ruta/:rutaId', getHorariosByRuta);

// Rutas protegidas (requieren autenticación y rol de admin)
router.post('/', authenticate, authorize(['admin']), createHorario);
router.put('/:id', authenticate, authorize(['admin']), updateHorario);
router.delete('/:id', authenticate, authorize(['admin']), deleteHorario);

export default router;