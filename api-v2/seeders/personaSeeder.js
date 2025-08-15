// seeders/personaSeeder.js
import { faker } from '@faker-js/faker';

const GENERO = ['M', 'F', 'O'];
const TIPO = ['usuario', 'acompanante', 'externo'];

export const seedPersonas = async ({ models }, cantidad = 100) => {
  const { Persona } = models;
  const personas = [];

  for (let i = 0; i < cantidad; i++) {
    const nombre = faker.person.firstName();
    const ap1 = faker.person.lastName();
    const ap2 = faker.person.lastName();
    const p = await Persona.create({
      nombre,
      primer_apellido: ap1,
      segundo_apellido: ap2,
      genero: GENERO[i % GENERO.length],
      fecha_nacimiento: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      tipo: TIPO[0], // la mayoría 'usuario'
      documento_identidad: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
    });
    personas.push(p);
  }
  console.log(`👤 Personas creadas: ${personas.length}`);
  return personas;
};
