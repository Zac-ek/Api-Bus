import { Router } from 'express';
import { buscarViajes, obtenerAsientos } from '../controllers/viajes.controller.js';
import { listOrigins, listDestinations } from '../controllers/rutas.controller.js';

const router = Router();

router.get('/viajes', buscarViajes);
// routes/viajes.routes.js
router.get('/viajes/:id/asientos', obtenerAsientos);

router.get('/rutas/origenes', listOrigins);
router.get('/rutas/destinos', listDestinations);

export default router;
