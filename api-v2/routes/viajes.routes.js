import { Router } from 'express';
import { searchTrips } from '../controllers/viajes.controller.js';
import { listOrigins, listDestinations } from '../controllers/rutas.controller.js';

const router = Router();

router.get('/trips', searchTrips);
router.get('/rutas/origenes', listOrigins);
router.get('/rutas/destinos', listDestinations);

export default router;
