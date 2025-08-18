import express from 'express';
import {
  getAllTrabajadores,
  getTrabajadorById,
  createTrabajador,
  updateTrabajador,
  deleteTrabajador,
  getTrabajadoresByPuesto
} from '../controllers/trabajadores.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllTrabajadores);
router.get('/:id', getTrabajadorById);
router.get('/puesto/:puesto', getTrabajadoresByPuesto);

// Rutas protegidas (requieren autenticación y rol de admin)
router.post('/', authenticate, authorize(['admin']), createTrabajador);
router.put('/:id', authenticate, authorize(['admin']), updateTrabajador);
router.delete('/:id', authenticate, authorize(['admin']), deleteTrabajador);

export default router;