import express from 'express';
import { recomendarDestinos, predecirRutasPopulares } from '../controllers/recomendation.controller.js';

const router = express.Router();

router.get('/recomendaciones', recomendarDestinos);
router.get('/predecir-rutas-populares', predecirRutasPopulares);

export default router;