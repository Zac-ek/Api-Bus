/**
 * @swagger
 * /api/recomendaciones:
 *   get:
 *     summary: Obtiene recomendaciones de destinos
 *     description: Proxy que consume el modelo de recomendación Python
 *     tags:
 *       - Recomendaciones
 *     parameters:
 *       - in: query
 *         name: origen
 *         schema:
 *           type: string
 *         example: "Ciudad de México"
 *       - in: query
 *         name: precio
 *         schema:
 *           type: number
 *         example: 400
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recomendacion'
 * 
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
 */