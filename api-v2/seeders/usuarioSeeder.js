import { faker } from '@faker-js/faker';

export const seedUsuarios = async ({ models, personas, personasAdminIds = [] }) => {
  const { Usuario } = models;
  const usuarios = [];
  const mapPersonaToUsuario = new Map();
  const correosRegistrados = new Set(); // Para trackear correos únicos

  // Admins fijos
  const adminCredsFijas = {
    ADMIN001: { usuario: 'admin.edgar', correo: 'admin.edgar@demo.com', password: 'Admin#edgar2025' },
    ADMIN002: { usuario: 'admin.zacek',  correo: 'admin.zacek@demo.com',  password: 'Admin#zacek2025'  },
  };

  for (const persona of personas) {
    let usuario, correo, password;

    // Verificar si es admin fijo
    if (adminCredsFijas[persona.documento_identidad]) {
      ({ usuario, correo, password } = adminCredsFijas[persona.documento_identidad]);
    } else {
      // Generar usuario base
      usuario = faker.internet.username({
        firstName: persona.nombre,
        lastName: persona.primer_apellido
      }).toLowerCase();

      // Generar correo base
      correo = faker.internet.email({
        firstName: persona.nombre,
        lastName: persona.primer_apellido
      }).toLowerCase();

      password = 'Secret123*';

      // Manejar colisión de correos
      let correoFinal = correo;
      let contador = 1;
      
      while (correosRegistrados.has(correoFinal)) {
        correoFinal = `${correo.split('@')[0]}${contador}@${correo.split('@')[1]}`;
        contador++;
      }
      
      correo = correoFinal;
    }

    // Registrar correo usado
    correosRegistrados.add(correo);

    // Crear usuario
    const u = await Usuario.create({
      personaId: persona.id,
      usuario,
      correo_electronico: correo,
      telefono: faker.phone.number('+52##########'),
      contrasena_hash: password,
      estado: 'activo',
      is_active: true,
      is_staff: persona.tipo === 'administrador',
    });

    usuarios.push(u);
    mapPersonaToUsuario.set(persona.id, u);
  }

  const totalStaff = usuarios.filter(x => x.is_staff).length;
  console.log(`🧑‍💻 Usuarios: ${usuarios.length} (staff: ${totalStaff}) | Correos únicos: ${correosRegistrados.size}`);
  return { usuarios, mapPersonaToUsuario };
};