import Usuario from '../models/usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @description Obtener todos los usuarios (con paginación)
 * @requires admin
 */
export const getAllUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Usuario.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['contrasena_hash'] },
      include: ['persona']
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      usuarios: rows
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message 
    });
  }
};

/**
 * @description Obtener un usuario por ID
 */
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['contrasena_hash'] },
      include: ['persona']
    });

    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      usuario
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener usuario',
      error: error.message 
    });
  }
};

/**
 * @description Crear un nuevo usuario
 */
export const createUsuario = async (req, res) => {
  try {
    const { correo_electronico, contrasena, ...userData } = req.body;

    // Verificar si el correo ya existe
    const existeUsuario = await Usuario.findOne({ where: { correo_electronico } });
    if (existeUsuario) {
      return res.status(400).json({ 
        success: false,
        message: 'El correo electrónico ya está registrado' 
      });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      correo_electronico,
      contrasena_hash: contrasena, // Se hashea automáticamente por el setter del modelo
      ...userData
    });

    // Excluir contraseña en la respuesta
    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.contrasena_hash;

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: usuarioResponse
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al crear usuario',
      error: error.message 
    });
  }
};

/**
 * @description Actualizar un usuario
 */
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { contrasena, ...updateData } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Actualizar contraseña si se proporciona
    if (contrasena) {
      usuario.contrasena_hash = contrasena; // Se hashea automáticamente
    }

    // Actualizar otros campos
    await usuario.update(updateData);

    // Excluir contraseña en la respuesta
    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.contrasena_hash;

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: usuarioResponse
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message 
    });
  }
};

/**
 * @description Eliminar un usuario (soft delete)
 */
export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Soft delete (marcar como inactivo)
    await usuario.update({ 
      estado: 'inactivo',
      is_active: false 
    });

    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al desactivar usuario',
      error: error.message 
    });
  }
};

/**
 * @description Eliminar un usuario permanentemente (admin)
 */
export const hardDeleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    await usuario.destroy();
    res.json({
      success: true,
      message: 'Usuario eliminado permanentemente'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message 
    });
  }
};