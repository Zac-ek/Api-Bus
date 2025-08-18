import express from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  hardDeleteUsuario
} from '../controllers/usuarios.controller.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();


// Rutas públicas
router.post('/', createUsuario);

// Rutas protegidas (requieren autenticación)
router.use(authenticate);

// Rutas básicas CRUD
router.get('/', authorize(['administrativo']), getAllUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

// Ruta especial para admin (eliminación permanente)
router.delete('/:id/hard', authorize(['administrativo']), hardDeleteUsuario);

export default router;