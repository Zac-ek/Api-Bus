// seeders/personaSeeder.js
import { faker } from '@faker-js/faker';

const GENERO = ['M', 'F', 'O'];
const TIPO = ['usuario', 'acompanante', 'externo', 'trabajador'];

export const seedPersonas = async ({ models }, cantidad = 100, porcentajeTrabajador = 0.30) => {
  const { Persona } = models;
  const personas = [];
  const personasTrabajadorIds = [];

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

  console.log(`👤 Personas creadas: ${personas.length} (trabajadores: ${personasTrabajadorIds.length})`);
  return { personas, personasTrabajadorIds };
};
