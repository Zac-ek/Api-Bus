// seeders/usuarioSeeder.js
import { faker } from '@faker-js/faker';

export const seedUsuarios = async ({ models, personas }, cantidadAdmins = 3) => {
  const { Usuario } = models;
  const usuarios = [];

  // Creamos un usuario por persona (1:1)
  for (let i = 0; i < personas.length; i++) {
    const persona = personas[i];
    const username = faker.internet.userName({ firstName: persona.nombre, lastName: persona.primer_apellido }).toLowerCase();
    const correo = faker.internet.email({ firstName: persona.nombre, lastName: persona.primer_apellido }).toLowerCase();

    const u = await Usuario.create({
      personaId: persona.id,
      usuario: username,
      correo_electronico: correo,
      telefono: faker.phone.number('+52##########'),
      contrasena_hash: 'Secret123*',   // setter del modelo lo hashea
      estado: 'activo',
      is_active: true,
      is_staff: i < cantidadAdmins,    // primeros N serán staff
    });
    usuarios.push(u);
  }

  console.log(`🧑‍💻 Usuarios creados: ${usuarios.length} (staff: ${cantidadAdmins})`);
  return usuarios;
};
