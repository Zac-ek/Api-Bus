import express from 'express';
import { recomendarDestinos } from '../controllers/recomendation.controller.js';

const router = express.Router();

router.get('/', recomendarDestinos);

export default router;