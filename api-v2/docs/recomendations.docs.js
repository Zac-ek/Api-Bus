/**
 * @swagger
 * tags:
 *   - name: Recomendaciones
 *     description: Sistema de recomendación de destinos
 *   - name: Predicciones
 *     description: Predicción de rutas populares

 * /api/recomendaciones:
 *   get:
 *     summary: Obtiene recomendaciones de destinos
 *     description: Proxy que consume el modelo de recomendación Python
 *     tags: [Recomendaciones]
 *     parameters:
 *       - in: query
 *         name: origen
 *         schema:
 *           type: string
 *         required: true
 *         example: "Ciudad de México"
 *       - in: query
 *         name: precio
 *         schema:
 *           type: number
 *         required: true
 *         example: 400
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recomendacion'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 * /api/predecir-rutas-populares:
 *   get:
 *     summary: Predice rutas con alta demanda
 *     description: Consulta el modelo de predicción para identificar rutas populares en una fecha específica
 *     tags: [Predicciones]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         example: "2025-08-20"
 *     responses:
 *       200:
 *         description: Predicción exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrediccionRutas'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 * components:
 *   schemas:
 *     Recomendacion:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         origen:
 *           type: string
 *         precio_referencia:
 *           type: number
 *         recomendaciones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DetalleRecomendacion'
 * 
 *     DetalleRecomendacion:
 *       type: object
 *       properties:
 *         destino:
 *           type: string
 *         precio:
 *           type: number
 *         empresa:
 *           type: string
 *         duracion:
 *           type: string
 * 
 *     PrediccionRutas:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         fecha_consulta:
 *           type: string
 *           format: date
 *         rutas_populares:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DetalleRuta'
 * 
 *     DetalleRuta:
 *       type: object
 *       properties:
 *         origen:
 *           type: string
 *         destino:
 *           type: string
 *         probabilidad_ocupacion:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 1
 *         nivel_demanda:
 *           type: string
 *           enum: [baja, media, alta]
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 */