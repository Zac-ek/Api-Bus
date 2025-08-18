import express from 'express';
import {
  getAllRutas,
  getRutaById,
  createRuta,
  updateRuta,
  changeRutaStatus,
  deleteRuta
} from '../controllers/rutas.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllRutas);
router.get('/:id', getRutaById);

// Rutas protegidas (requieren autenticación y rol de admin)
router.post('/', authenticate, authorize(['admin']), createRuta);
router.put('/:id', authenticate, authorize(['admin']), updateRuta);
router.patch('/:id/estado', authenticate, authorize(['admin']), changeRutaStatus);
router.delete('/:id', authenticate, authorize(['admin']), deleteRuta);

export default router;