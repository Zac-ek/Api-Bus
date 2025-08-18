import express from 'express';
import { login, verifyAuth } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authenticate, verifyAuth);

export default router;