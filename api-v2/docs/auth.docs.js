/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Operaciones de autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo_electronico
 *               - contrasena
 *             properties:
 *               correo_electronico:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Credenciales faltantes
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verificar autenticación
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error del servidor
 */
