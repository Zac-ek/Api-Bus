// seeders/personaSeeder.js
import { faker } from '@faker-js/faker';

const GENERO = ['M', 'F', 'O'];
const TIPO = ['usuario', 'acompanante', 'externo', 'trabajador', 'administrador'];

export const seedPersonas = async ({ models }, cantidad = 100, porcentajeTrabajador = 0.30) => {
  const { Persona } = models;
  const personas = [];
  const personasTrabajadorIds = [];
  const personasAdminIds = [];

  // 👑 Admins por defecto
  const adminsPorDefecto = [
    {
      nombre: 'Edgar',
      primer_apellido: 'Cruz',
      segundo_apellido: 'Salas',
      genero: 'M',
      fecha_nacimiento: new Date('1990-01-01'),
      tipo: 'administrador',
      documento_identidad: 'ADMIN001'
    },
    {
      nombre: 'Zacek',
      primer_apellido: 'Gutiérrez',
      segundo_apellido: 'Cruz',
      genero: 'M',
      fecha_nacimiento: new Date('1985-05-10'),
      tipo: 'administrador',
      documento_identidad: 'ADMIN002'
    }
  ];

  for (const admin of adminsPorDefecto) {
    const p = await Persona.create(admin);
    personas.push(p);
    personasAdminIds.push(p.id);
  }

  // 👥 Personas aleatorias
  for (let i = 0; i < cantidad; i++) {
    const esTrabajador = Math.random() < porcentajeTrabajador;
    const p = await Persona.create({
      nombre: faker.person.firstName(),
      primer_apellido: faker.person.lastName(),
      segundo_apellido: faker.person.lastName(),
      genero: GENERO[i % GENERO.length],
      fecha_nacimiento: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      tipo: esTrabajador ? 'trabajador' : 'usuario',
      documento_identidad: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
    });
    if (esTrabajador) personasTrabajadorIds.push(p.id);
    personas.push(p);
  }

  console.log(`👑 Admins: ${personasAdminIds.length} | 👤 Personas: ${personas.length} | 👷 Trabajadores marcados: ${personasTrabajadorIds.length}`);
  return { personas, personasTrabajadorIds, personasAdminIds };
};
