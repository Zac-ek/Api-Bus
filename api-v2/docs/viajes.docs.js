/**
 * @swagger
 * tags:
 *   name: Viajes
 *   description: Endpoints para gestión de viajes y rutas (basados en vistas SQL)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Viaje:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID compuesto del viaje (rutaId-horarioId)
 *         rutaId:
 *           type: integer
 *           description: ID de la ruta
 *         origen:
 *           type: string
 *           description: Punto de origen del viaje
 *         destino:
 *           type: string
 *           description: Punto de destino del viaje
 *         salida:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de salida
 *         llegada:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora estimada de llegada
 *         precio:
 *           type: number
 *           description: Precio del viaje (calculado basado en distancia)
 *         empresa:
 *           type: string
 *           description: Nombre de la empresa operadora
 *         clase:
 *           type: string
 *           description: Clase de servicio (Ej. Económica)
 *         asientosDisponibles:
 *           type: integer
 *           description: Cantidad de asientos disponibles
 *       example:
 *         id: "5-12"
 *         rutaId: 5
 *         origen: "Ciudad de México"
 *         destino: "Guadalajara"
 *         salida: "2023-11-15T08:00:00.000Z"
 *         llegada: "2023-11-15T14:30:00.000Z"
 *         precio: 450
 *         empresa: "ByteBuss"
 *         clase: "Económica"
 *         asientosDisponibles: 24
 */

/**
 * @swagger
 * /api/viajes:
 *   get:
 *     summary: Buscar viajes disponibles
 *     description: |
 *       Obtiene los viajes disponibles entre un origen y destino en una fecha específica.
 *       **Nota:** Este endpoint utiliza vistas SQL para organizar y optimizar la información.
 *     tags: [Viajes]
 *     parameters:
 *       - in: query
 *         name: origen
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad o punto de origen
 *       - in: query
 *         name: destino
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad o punto de destino
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de viaje (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de viajes disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Viaje'
 *       400:
 *         description: Parámetros requeridos faltantes
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /api/rutas/origenes:
 *   get:
 *     summary: Obtener lista de orígenes disponibles
 *     description: |
 *       Devuelve un listado de todos los puntos de origen disponibles.
 *       **Nota:** Los datos provienen de una vista SQL optimizada para esta consulta frecuente.
 *     tags: [Viajes]
 *     responses:
 *       200:
 *         description: Lista de orígenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Ciudad de México", "Guadalajara", "Monterrey"]
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /api/rutas/destinos:
 *   get:
 *     summary: Obtener destinos disponibles para un origen
 *     description: |
 *       Devuelve los destinos disponibles desde un origen específico.
 *       **Nota:** Utiliza una vista SQL precalculada para mejorar el rendimiento.
 *     tags: [Viajes]
 *     parameters:
 *       - in: query
 *         name: origen
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad o punto de origen para filtrar destinos
 *     responses:
 *       200:
 *         description: Lista de destinos disponibles desde el origen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Guadalajara", "Querétaro", "Puebla"]
 *       400:
 *         description: Parámetro 'origen' requerido
 *       500:
 *         description: Error en el servidor
 */