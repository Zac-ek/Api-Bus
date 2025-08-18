/**
 * @swagger
 * tags:
 *   name: Rutas
 *   description: Gestión de rutas de transporte
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ruta:
 *       type: object
 *       required:
 *         - nombre
 *         - punto_inicio
 *         - punto_final
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado
 *         nombre:
 *           type: string
 *           description: Nombre descriptivo de la ruta
 *         punto_inicio:
 *           type: string
 *           description: Punto de origen de la ruta
 *         punto_final:
 *           type: string
 *           description: Punto de destino de la ruta
 *         distancia_km:
 *           type: number
 *           format: float
 *           description: Distancia en kilómetros
 *         tiempo_estimado_seg:
 *           type: integer
 *           description: Tiempo estimado en segundos
 *         autobus_asignadoId:
 *           type: integer
 *           description: ID del autobús asignado
 *         activo:
 *           type: boolean
 *           default: true
 *           description: Estado de la ruta
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         nombre: "CDMX - Guadalajara"
 *         punto_inicio: "Ciudad de México"
 *         punto_final: "Guadalajara"
 *         distancia_km: 540.5
 *         tiempo_estimado_seg: 21600
 *         autobus_asignadoId: 3
 *         activo: true
 */

/**
 * @swagger
 * /api/rutas:
 *   get:
 *     summary: Obtener todas las rutas
 *     tags: [Rutas]
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo/inactivo
 *       - in: query
 *         name: punto_inicio
 *         schema:
 *           type: string
 *         description: Filtrar por punto de inicio (búsqueda parcial)
 *       - in: query
 *         name: punto_final
 *         schema:
 *           type: string
 *         description: Filtrar por punto final (búsqueda parcial)
 *     responses:
 *       200:
 *         description: Lista de rutas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ruta'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rutas/{id}:
 *   get:
 *     summary: Obtener una ruta por ID
 *     tags: [Rutas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruta
 *     responses:
 *       200:
 *         description: Datos de la ruta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Ruta'
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rutas:
 *   post:
 *     summary: Crear una nueva ruta
 *     tags: [Rutas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ruta'
 *     responses:
 *       201:
 *         description: Ruta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Ruta'
 *       400:
 *         description: Datos inválidos u origen/destino iguales
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rutas/{id}:
 *   put:
 *     summary: Actualizar una ruta existente
 *     tags: [Rutas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ruta'
 *     responses:
 *       200:
 *         description: Ruta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Ruta'
 *       400:
 *         description: Datos inválidos u origen/destino iguales
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rutas/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de una ruta (activar/desactivar)
 *     tags: [Rutas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activo:
 *                 type: boolean
 *             required:
 *               - activo
 *     responses:
 *       200:
 *         description: Estado de la ruta actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Ruta'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rutas/{id}:
 *   delete:
 *     summary: Eliminar una ruta
 *     tags: [Rutas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruta
 *     responses:
 *       200:
 *         description: Ruta eliminada exitosamente
 *       400:
 *         description: No se puede eliminar (tiene horarios asociados)
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error del servidor
 */