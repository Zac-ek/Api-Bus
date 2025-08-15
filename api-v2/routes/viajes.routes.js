import { Router } from 'express';
import { buscarViajes } from '../controllers/viajes.controller.js';
import { listOrigins, listDestinations } from '../controllers/rutas.controller.js';

const router = Router();

router.get('/viajes', buscarViajes);
router.get('/rutas/origenes', listOrigins);
router.get('/rutas/destinos', listDestinations);

export default router;
