import express from 'express';
import {
  getAllBoletos,
  getBoletoById,
  createBoleto,
  updateBoleto,
  cancelBoleto,
  deleteBoleto
} from '../controllers/boletos.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas (solo algunas podrían ser públicas)
router.get('/', getAllBoletos);
router.get('/:id', getBoletoById);

// Rutas protegidas
router.post('/', authenticate, createBoleto);
router.put('/:id', authenticate, updateBoleto);
router.patch('/:id/cancelar', authenticate, cancelBoleto);

// Rutas solo para administradores
router.delete('/:id', authenticate, authorize(['admin']), deleteBoleto);

export default router;