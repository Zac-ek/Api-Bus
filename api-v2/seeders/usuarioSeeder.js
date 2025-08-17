// seeders/usuarioSeeder.js
import { faker } from '@faker-js/faker';

export const seedUsuarios = async ({ models, personas, personasAdminIds = [] }) => {
  const { Usuario } = models;
  const usuarios = [];
  const mapPersonaToUsuario = new Map();

  // Para identificar admins por defecto por su documento_identidad (opcional)
  const adminCredsFijas = {
    ADMIN001: { usuario: 'admin.carlos', correo: 'admin.carlos@demo.com', password: 'Admin#Carlos2025' },
    ADMIN002: { usuario: 'admin.maria',  correo: 'admin.maria@demo.com',  password: 'Admin#Maria2025'  },
  };

  for (const persona of personas) {
    // ¿Es uno de los admins fijos?
    let usuario, correo, password;
    if (adminCredsFijas[persona.documento_identidad]) {
      ({ usuario, correo, password } = adminCredsFijas[persona.documento_identidad]);
    } else {
      usuario = faker.internet.username({
        firstName: persona.nombre,
        lastName: persona.primer_apellido
      }).toLowerCase();

      correo = faker.internet.email({
        firstName: persona.nombre,
        lastName: persona.primer_apellido
      }).toLowerCase();

      password = 'Secret123*'; // tu setter/hook debería hashearla
    }

    // Evita colisiones simples de username/correo
    const rand = faker.string.alphanumeric({ length: 4 }).toLowerCase();
    const u = await Usuario.create({
      personaId: persona.id,
      usuario,
      correo_electronico: correo,
      telefono: faker.phone.number('+52##########'),
      contrasena_hash: password,   // <- setter/hook hashea
      estado: 'activo',
      is_active: true,
      is_staff: persona.tipo === 'administrador', // ← clave
    });

    usuarios.push(u);
    mapPersonaToUsuario.set(persona.id, u);
  }

  const totalStaff = usuarios.filter(x => x.is_staff).length;
  console.log(`🧑‍💻 Usuarios: ${usuarios.length} (staff: ${totalStaff})`);
  return { usuarios, mapPersonaToUsuario };
};
