/**
 * @swagger
 * tags:
 *   name: Personas
 *   description: Gestión de personas en el sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       required:
 *         - nombre
 *         - primer_apellido
 *         - genero
 *         - tipo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado
 *         nombre:
 *           type: string
 *           description: Nombre(s) de la persona
 *         primer_apellido:
 *           type: string
 *           description: Primer apellido
 *         segundo_apellido:
 *           type: string
 *           description: Segundo apellido (opcional)
 *         genero:
 *           type: string
 *           enum: [M, F, O]
 *           description: Género (M=Masculino, F=Femenino, O=Otro)
 *         fecha_nacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento (YYYY-MM-DD)
 *         tipo:
 *           type: string
 *           enum: [usuario, acompanante, externo]
 *           description: Tipo de persona
 *         documento_identidad:
 *           type: string
 *           description: Número de documento de identidad
 *       example:
 *         nombre: "Juan"
 *         primer_apellido: "Pérez"
 *         segundo_apellido: "López"
 *         genero: "M"
 *         fecha_nacimiento: "1990-01-15"
 *         tipo: "usuario"
 *         documento_identidad: "1234567890"
 */

/**
 * @swagger
 * /api/personas:
 *   get:
 *     summary: Obtener todas las personas
 *     tags: [Personas]
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [usuario, acompanante, externo]
 *         description: Filtrar por tipo de persona
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *           enum: [M, F, O]
 *         description: Filtrar por género
 *       - in: query
 *         name: documento
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por documento de identidad
 *     responses:
 *       200:
 *         description: Lista de personas
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
 *                     $ref: '#/components/schemas/Persona'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/personas/search:
 *   get:
 *     summary: Buscar personas por nombre o apellido
 *     tags: [Personas]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda (mínimo 3 caracteres)
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
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
 *                     $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Término de búsqueda muy corto
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/personas/{id}:
 *   get:
 *     summary: Obtener una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la persona
 *     responses:
 *       200:
 *         description: Datos de la persona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Persona'
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/personas:
 *   post:
 *     summary: Crear una nueva persona
 *     tags: [Personas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       201:
 *         description: Persona creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Datos inválidos o documento duplicado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/personas/{id}:
 *   put:
 *     summary: Actualizar una persona existente
 *     tags: [Personas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la persona
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       200:
 *         description: Persona actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Datos inválidos o documento duplicado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/personas/{id}:
 *   delete:
 *     summary: Eliminar una persona
 *     tags: [Personas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la persona
 *     responses:
 *       200:
 *         description: Persona eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: No se puede eliminar (tiene usuario asociado)
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error del servidor
 */