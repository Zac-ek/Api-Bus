/**
 * @swagger
 * tags:
 *   name: Boletos
 *   description: Gestión de boletos del sistema de transporte
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Boleto:
 *       type: object
 *       required:
 *         - usuarioId
 *         - rutaId
 *         - autobusId
 *         - horarioId
 *         - fecha_viaje
 *         - asiento_numero
 *         - precio
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado
 *         usuarioId:
 *           type: integer
 *           description: ID del usuario que reservó
 *         rutaId:
 *           type: integer
 *           description: ID de la ruta
 *         autobusId:
 *           type: integer
 *           description: ID del autobús asignado
 *         horarioId:
 *           type: integer
 *           description: ID del horario seleccionado
 *         fecha_reservacion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la reservación
 *         fecha_viaje:
 *           type: string
 *           format: date
 *           description: Fecha del viaje (YYYY-MM-DD)
 *         asiento_numero:
 *           type: integer
 *           description: Número de asiento asignado
 *         estado:
 *           type: string
 *           enum: [reservado, cancelado, completado]
 *           default: reservado
 *         precio:
 *           type: number
 *           format: float
 *           description: Precio del boleto
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *         ruta:
 *           $ref: '#/components/schemas/Ruta'
 *         autobus:
 *           $ref: '#/components/schemas/Autobus'
 *         horario:
 *           $ref: '#/components/schemas/Horario'
 *       example:
 *         id: 1
 *         usuarioId: 5
 *         rutaId: 3
 *         autobusId: 7
 *         horarioId: 12
 *         fecha_reservacion: "2023-11-10T14:30:00.000Z"
 *         fecha_viaje: "2023-12-15"
 *         asiento_numero: 14
 *         estado: "reservado"
 *         precio: 350.50
 */

/**
 * @swagger
 * /api/boletos:
 *   get:
 *     summary: Obtener todos los boletos
 *     tags: [Boletos]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [reservado, cancelado, completado]
 *         description: Filtrar por estado
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar desde fecha de viaje (YYYY-MM-DD)
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar hasta fecha de viaje (YYYY-MM-DD)
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de usuario
 *     responses:
 *       200:
 *         description: Lista de boletos
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
 *                     $ref: '#/components/schemas/Boleto'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/boletos/{id}:
 *   get:
 *     summary: Obtener un boleto por ID
 *     tags: [Boletos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del boleto
 *     responses:
 *       200:
 *         description: Datos del boleto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Boleto'
 *       404:
 *         description: Boleto no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/boletos:
 *   post:
 *     summary: Crear un nuevo boleto
 *     tags: [Boletos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Boleto'
 *     responses:
 *       201:
 *         description: Boleto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Boleto'
 *       400:
 *         description: Datos inválidos o asiento ocupado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/boletos/{id}:
 *   put:
 *     summary: Actualizar un boleto existente
 *     tags: [Boletos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del boleto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Boleto'
 *     responses:
 *       200:
 *         description: Boleto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Boleto'
 *       400:
 *         description: Datos inválidos o cambio de estado no permitido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Boleto no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/boletos/{id}/cancelar:
 *   patch:
 *     summary: Cancelar un boleto
 *     tags: [Boletos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del boleto
 *     responses:
 *       200:
 *         description: Boleto cancelado exitosamente
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
 *                   $ref: '#/components/schemas/Boleto'
 *       400:
 *         description: Boleto ya cancelado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Boleto no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/boletos/{id}:
 *   delete:
 *     summary: Eliminar un boleto (solo administradores)
 *     tags: [Boletos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del boleto
 *     responses:
 *       200:
 *         description: Boleto eliminado permanentemente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos (requiere rol admin)
 *       404:
 *         description: Boleto no encontrado
 *       500:
 *         description: Error del servidor
 */