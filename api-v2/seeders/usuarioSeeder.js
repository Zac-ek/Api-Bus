// seeders/usuarioSeeder.js
import { faker } from '@faker-js/faker';

export const seedUsuarios = async ({ models, personas }, cantidadAdmins = 5) => {
  const { Usuario } = models;
  const usuarios = [];
  const mapPersonaToUsuario = new Map();

  for (let i = 0; i < personas.length; i++) {
    const persona = personas[i];
    const username = faker.internet.username({
      firstName: persona.nombre,
      lastName: persona.primer_apellido
    }).toLowerCase();

    const correo = faker.internet.email({
      firstName: persona.nombre,
      lastName: persona.primer_apellido
    }).toLowerCase();

    const u = await Usuario.create({
      personaId: persona.id,
      usuario: username,
      correo_electronico: correo,
      telefono: faker.phone.number('+52##########'),
      contrasena_hash: 'Secret123*', // el setter del modelo la hashea
      estado: 'activo',
      is_active: true,
      is_staff: i < cantidadAdmins, // primeros N como staff
    });

    usuarios.push(u);
    mapPersonaToUsuario.set(persona.id, u);
  }

  console.log(`🧑‍💻 Usuarios creados: ${usuarios.length} (staff: ${cantidadAdmins})`);
  return { usuarios, mapPersonaToUsuario };
};
