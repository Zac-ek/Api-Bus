// seeders/usuarioSeeder.js
import { faker } from '@faker-js/faker';

// Normaliza strings: sin acentos/diacríticos, minúsculas, solo [a-z0-9._]
const norm = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._]+/g, '.')
    .replace(/\.+/g, '.')
    .replace(/^\.+|\.+$/g, '');

function makeUnique(base, used, compose) {
  // compose(base, n) -> valor
  let n = 0;
  let val = compose(base, n);
  while (used.has(val)) {
    n += 1;
    val = compose(base, n);
  }
  used.add(val);
  return val;
}

export const seedUsuarios = async ({ models, personas, personasAdminIds = [] }) => {
  const { Usuario } = models;
  const usuarios = [];
  const mapPersonaToUsuario = new Map();

  // Sets de unicidad en memoria
  const correosRegistrados = new Set();
  const usuariosRegistrados = new Set();

  // Admins fijos
  const adminCredsFijas = {
    ADMIN001: { usuario: 'admin.edgar', correo: 'admin.edgar@demo.com', password: 'Admin#edgar2025' },
    ADMIN002: { usuario: 'admin.zacek', correo: 'admin.zacek@demo.com',  password: 'Admin#zacek2025'  },
  };

  // Reserva los correos/usuarios fijos para evitar colisión
  for (const k of Object.keys(adminCredsFijas)) {
    const { usuario, correo } = adminCredsFijas[k];
    usuariosRegistrados.add(usuario.toLowerCase());
    correosRegistrados.add(correo.toLowerCase());
  }

  for (const persona of personas) {
    const nombre = norm(persona?.nombre) || 'user';
    const apellido = norm(persona?.primer_apellido) || 'demo';

    let usuario;
    let correo;
    let password = 'Secret123*';

    if (adminCredsFijas[persona.documento_identidad]) {
      const fixed = adminCredsFijas[persona.documento_identidad];
      // Asegura que no colisione con otros (por si ya estaban “reservados”)
      usuario = makeUnique(
        fixed.usuario.toLowerCase(),
        usuariosRegistrados,
        (base, n) => (n === 0 ? base : `${base}${n}`)
      );

      const [localFixed, domainFixed] = fixed.correo.toLowerCase().split('@');
      correo = makeUnique(
        `${localFixed}@${domainFixed}`,
        correosRegistrados,
        (base, n) => {
          const [local, domain] = base.split('@');
          return n === 0 ? base : `${local}${n}@${domain}`;
        }
      );

      password = fixed.password;
    } else {
      // Usuario base: nombre.apellido
      const baseUser = `${nombre}.${apellido}`.replace(/\.+/g, '.').replace(/^\.+|\.+$/g, '');
      usuario = makeUnique(
        baseUser || `user${persona.id || ''}`,
        usuariosRegistrados,
        (base, n) => (n === 0 ? base : `${base}${n}`)
      );

    
      const domain = faker.internet.domainName().toLowerCase(); // p.ej. example.com
      const baseLocal = (nombre && apellido) ? `${nombre}.${apellido}` : (nombre || `user${persona.id || ''}`);
      const baseEmail = `${baseLocal}@${domain}`.replace(/\.+@/, '@'); // evita "....@"
      correo = makeUnique(
        baseEmail,
        correosRegistrados,
        (base, n) => {
          const [local, dom] = base.split('@');
          return n === 0 ? base : `${local}${n}@${dom}`;
        }
      );
    }

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
  console.log(`🧑‍💻 Usuarios: ${usuarios.length} (staff: ${totalStaff}) | Correos únicos: ${correosRegistrados.size} | Users únicos: ${usuariosRegistrados.size}`);
  return { usuarios, mapPersonaToUsuario };
};
