import Persona from '../models/persona.js';
import Usuario from '../models/usuario.js';

export const login = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;

    // 1. Validar que se enviaron credenciales
    if (!correo_electronico || !contrasena) {
      return res.status(400).json({ 
        success: false,
        message: 'Por favor proporciona correo y contraseña' 
      });
    }

    // 2. Buscar usuario
    const usuario = await Usuario.findOne({ 
      where: { correo_electronico },
      include: [{
        model: Persona, as: 'persona',
        attributes: ['nombre', 'primer_apellido']
      }]
    });

    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // 3. Verificar contraseña
    const isMatch = await usuario.comparePassword(contrasena);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // 4. Generar token JWT
    const token = usuario.generateAuthToken();

    // 5. Responder con token y datos del usuario
    res.json({
      success: true,
      token,
      user: {
        id: usuario.id,
        email: usuario.correo_electronico,
        name: `${usuario.persona.nombre} ${usuario.persona.primer_apellido}`,
        role: usuario.role || 'user'
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

export const verifyAuth = async (req, res) => {
  try {
    // El middleware de autenticación ya verificó el token
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['contrasena_hash'] },
      include: [{
        model: Persona,
        attributes: ['nombre', 'primer_apellido']
      }]
    });

    res.json({
      success: true,
      user: {
        id: usuario.id,
        email: usuario.correo_electronico,
        name: `${usuario.Persona.nombre} ${usuario.Persona.primer_apellido}`,
        role: usuario.role || 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar autenticación' 
    });
  }
};