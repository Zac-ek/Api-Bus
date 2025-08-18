/**
 * @swagger
 * tags:
 *   name: Trabajadores
 *   description: Gestión de trabajadores del sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Trabajador:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado
 *         usuarioId:
 *           type: integer
 *           description: ID del usuario asociado
 *         puesto:
 *           type: string
 *           enum: [conductor, supervisor, mantenimiento, administrativo]
 *           description: Puesto del trabajador
 *         turno:
 *           type: string
 *           enum: [matutino, vespertino, nocturno, mixto]
 *           description: Turno de trabajo
 *         fecha_ingreso:
 *           type: string
 *           format: date
 *           description: Fecha de ingreso (YYYY-MM-DD)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *       example:
 *         id: 1
 *         usuarioId: 5
 *         puesto: "conductor"
 *         turno: "matutino"
 *         fecha_ingreso: "2023-01-15"
 */

/**
 * @swagger
 * /api/trabajadores:
 *   get:
 *     summary: Obtener todos los trabajadores
 *     tags: [Trabajadores]
 *     parameters:
 *       - in: query
 *         name: puesto
 *         schema:
 *           type: string
 *           enum: [conductor, supervisor, mantenimiento, administrativo]
 *         description: Filtrar por puesto
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *           enum: [matutino, vespertino, nocturno, mixto]
 *         description: Filtrar por turno
 *     responses:
 *       200:
 *         description: Lista de trabajadores
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
 *                     $ref: '#/components/schemas/Trabajador'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/trabajadores/{id}:
 *   get:
 *     summary: Obtener un trabajador por ID
 *     tags: [Trabajadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del trabajador
 *     responses:
 *       200:
 *         description: Datos del trabajador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trabajador'
 *       404:
 *         description: Trabajador no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/trabajadores/puesto/{puesto}:
 *   get:
 *     summary: Obtener trabajadores por puesto
 *     tags: [Trabajadores]
 *     parameters:
 *       - in: path
 *         name: puesto
 *         schema:
 *           type: string
 *           enum: [conductor, supervisor, mantenimiento, administrativo]
 *         required: true
 *         description: Puesto del trabajador
 *     responses:
 *       200:
 *         description: Lista de trabajadores por puesto
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
 *                     $ref: '#/components/schemas/Trabajador'
 *       400:
 *         description: Puesto no válido
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/trabajadores:
 *   post:
 *     summary: Crear un nuevo trabajador
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trabajador'
 *     responses:
 *       201:
 *         description: Trabajador creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trabajador'
 *       400:
 *         description: Datos inválidos o usuario ya asignado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/trabajadores/{id}:
 *   put:
 *     summary: Actualizar un trabajador existente
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del trabajador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trabajador'
 *     responses:
 *       200:
 *         description: Trabajador actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trabajador'
 *       400:
 *         description: Datos inválidos o usuario ya asignado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Trabajador no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/trabajadores/{id}:
 *   delete:
 *     summary: Eliminar un trabajador
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del trabajador
 *     responses:
 *       200:
 *         description: Trabajador eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Trabajador no encontrado
 *       500:
 *         description: Error del servidor
 */