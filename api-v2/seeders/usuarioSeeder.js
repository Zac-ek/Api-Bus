// seeders/usuarioSeeder.js
import { faker } from '@faker-js/faker';

const normalizeLocalPart = (str) =>
  str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/^\.|\.$/g, '')               // quita '.' al inicio/fin
    .toLowerCase();


const generateUniqueEmail = async (Usuario, baseLocalPart, domain) => {
  let counter = 0;
  let candidate;
  // Evita bucles infinitos; en práctica no se llega ni de cerca.
  const MAX_TRIES = 10000;

  do {
    const suffix = counter === 0 ? '' : String(counter);
    candidate = `${baseLocalPart}${suffix}@${domain}`.toLowerCase();

    const existe = await Usuario.findOne({
      where: { correo_electronico: candidate },
      attributes: ['id'],
    });

    if (!existe) return candidate;
    counter += 1;
  } while (counter < MAX_TRIES);

  throw new Error('No se pudo generar un correo único después de muchos intentos.');
};

export const seedUsuarios = async ({ models, personas }, cantidadAdmins = 5) => {
  const { Usuario } = models;
  const usuarios = [];

  for (let i = 0; i < personas.length; i++) {
    const persona = personas[i];

    // Username "legible" a partir de nombre y primer apellido
    const username = normalizeLocalPart(`${persona.nombre}.${persona.primer_apellido}`);

    // Dominio aleatorio y local part base normalizado
    // (si prefieres un dominio fijo de tu proyecto, cámbialo por 'bytebuss.com' por ejemplo)
    const fakeEmail = faker.internet.email({
      firstName: persona.nombre,
      lastName: persona.primer_apellido,
    }).toLowerCase();

    const [rawLocal, rawDomain] = fakeEmail.split('@');
    const baseLocalPart = normalizeLocalPart(rawLocal || username || 'user');
    const domain = rawDomain || 'example.com';

    // Garantiza correo único en BD
    const correo = await generateUniqueEmail(Usuario, baseLocalPart, domain);

    const u = await Usuario.create({
      personaId: persona.id,
      usuario: username,
      correo_electronico: correo,
      telefono: faker.phone.number('+52##########'),
      contrasena_hash: 'Secret123*', // tu setter lo hashea con bcrypt
      estado: 'activo',
      is_active: true,
      is_staff: i < cantidadAdmins,
    });

    usuarios.push(u);
  }

  console.log(`🧑‍💻 Usuarios creados: ${usuarios.length} (staff: ${cantidadAdmins})`);
  return usuarios;
};