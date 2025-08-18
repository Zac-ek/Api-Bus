/**
 * @swagger
 * tags:
 *   name: Horarios
 *   description: Gestión de horarios de rutas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Horario:
 *       type: object
 *       required:
 *         - rutaId
 *         - hora_salida
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado
 *         rutaId:
 *           type: integer
 *           description: ID de la ruta asociada
 *         hora_salida:
 *           type: string
 *           format: time
 *           example: "08:00:00"
 *           description: Hora de salida (formato HH:MM:SS)
 *         hora_llegada:
 *           type: string
 *           format: time
 *           example: "12:30:00"
 *           description: Hora estimada de llegada (formato HH:MM:SS)
 *         dias_disponibles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
 *           example: ["Lunes", "Miércoles", "Viernes"]
 *           description: Días de la semana en que este horario está activo
 *         capacidad_disponible:
 *           type: integer
 *           minimum: 0
 *           description: Cantidad de asientos disponibles
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       example:
 *         id: 1
 *         rutaId: 5
 *         hora_salida: "08:00:00"
 *         hora_llegada: "12:30:00"
 *         dias_disponibles: ["Lunes", "Miércoles", "Viernes"]
 *         capacidad_disponible: 45
 */

/**
 * @swagger
 * /api/horarios:
 *   get:
 *     summary: Obtener todos los horarios
 *     tags: [Horarios]
 *     parameters:
 *       - in: query
 *         name: rutaId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de ruta
 *       - in: query
 *         name: dia
 *         schema:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
 *         description: Filtrar por día de la semana
 *     responses:
 *       200:
 *         description: Lista de horarios
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
 *                     $ref: '#/components/schemas/Horario'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/horarios/{id}:
 *   get:
 *     summary: Obtener un horario por ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Datos del horario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Horario'
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/horarios/ruta/{rutaId}:
 *   get:
 *     summary: Obtener horarios por ruta
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: rutaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruta
 *       - in: query
 *         name: dia
 *         schema:
 *           type: string
 *           enum: [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
 *         description: Filtrar por día de la semana
 *     responses:
 *       200:
 *         description: Lista de horarios para la ruta
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
 *                     $ref: '#/components/schemas/Horario'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/horarios:
 *   post:
 *     summary: Crear un nuevo horario
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Horario'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/horarios/{id}:
 *   put:
 *     summary: Actualizar un horario existente
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *     responses:
 *       200:
 *         description: Horario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Horario'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/horarios/{id}:
 *   delete:
 *     summary: Eliminar un horario
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error del servidor
 */