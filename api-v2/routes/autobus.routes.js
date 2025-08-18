import express from 'express';
import {
  getAllAutobuses,
  getAutobusById,
  createAutobus,
  updateAutobus,
  deleteAutobus,
  getAutobusesByEstado
} from '../controllers/autobus.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAutobuses);
router.get('/:id', getAutobusById);
router.get('/estado/:estado', getAutobusesByEstado);

// Rutas protegidas (requieren autenticación y rol de admin)
router.post('/', authenticate, authorize(['administrativo']), createAutobus);
router.put('/:id', authenticate, authorize(['administrativo']), updateAutobus);
router.delete('/:id', authenticate, authorize(['administrativo']), deleteAutobus);

export default router;