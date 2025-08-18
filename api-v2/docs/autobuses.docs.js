/**
 * @swagger
 * tags:
 *   name: Autobuses
 *   description: Gestión de autobuses del sistema
 */

/**
 * @swagger
 * /api/autobuses:
 *   get:
 *     summary: Obtener todos los autobuses
 *     tags: [Autobuses]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [activo, mantenimiento, fuera_servicio]
 *         description: Filtrar por estado
 *       - in: query
 *         name: modelo
 *         schema:
 *           type: string
 *         description: Filtrar por modelo (búsqueda parcial)
 *     responses:
 *       200:
 *         description: Lista de autobuses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Autobus'
 */

/**
 * @swagger
 * /api/autobuses/{id}:
 *   get:
 *     summary: Obtener un autobús por ID
 *     tags: [Autobuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autobús
 *     responses:
 *       200:
 *         description: Autobús encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Autobus'
 *       404:
 *         description: Autobús no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Autobus:
 *       type: object
 *       required:
 *         - placa
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado
 *         placa:
 *           type: string
 *           maxLength: 255
 *           unique: true
 *         modelo:
 *           type: string
 *         anio:
 *           type: integer
 *           minimum: 1900
 *         capacidad:
 *           type: integer
 *           minimum: 1
 *         estado:
 *           type: string
 *           enum: [activo, mantenimiento, fuera_servicio]
 *           default: activo
 *         conductorId:
 *           type: integer
 *           description: ID del conductor asignado
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         placa: "ABC-1234"
 *         modelo: "Mercedes Benz O500"
 *         anio: 2020
 *         capacidad: 50
 *         estado: "activo"
 *         conductorId: 5
 */

/**
 * @swagger
 * /api/autobuses:
 *   post:
 *     summary: Crear un nuevo autobús
 *     tags: [Autobuses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Autobus'
 *     responses:
 *       201:
 *         description: Autobús creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autobus'
 *       400:
 *         description: Datos inválidos o placa duplicada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/autobuses/{id}:
 *   put:
 *     summary: Actualizar un autobús existente
 *     tags: [Autobuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autobús
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Autobus'
 *     responses:
 *       200:
 *         description: Autobús actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autobus'
 *       400:
 *         description: Datos inválidos o placa duplicada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Autobús no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/autobuses/{id}:
 *   delete:
 *     summary: Eliminar un autobús
 *     tags: [Autobuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autobús
 *     responses:
 *       200:
 *         description: Autobús eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Autobús no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/autobuses/estado/{estado}:
 *   get:
 *     summary: Obtener autobuses por estado
 *     tags: [Autobuses]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [activo, mantenimiento, fuera_servicio]
 *         description: Estado del autobús
 *     responses:
 *       200:
 *         description: Lista de autobuses filtrados por estado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autobus'
 *       400:
 *         description: Estado no válido
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/autobuses/disponibles:
 *   get:
 *     summary: Obtener autobuses disponibles (activos y sin conductor asignado)
 *     tags: [Autobuses]
 *     responses:
 *       200:
 *         description: Lista de autobuses disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autobus'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/autobuses/{id}/asignar-conductor:
 *   patch:
 *     summary: Asignar conductor a un autobús
 *     tags: [Autobuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del autobús
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conductorId:
 *                 type: integer
 *             required:
 *               - conductorId
 *     responses:
 *       200:
 *         description: Conductor asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autobus'
 *       400:
 *         description: Conductor no válido o no encontrado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Autobús no encontrado
 *       500:
 *         description: Error del servidor
 */