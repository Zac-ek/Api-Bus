// seeders/autobusSeeder.js
import { faker } from '@faker-js/faker';

const ESTADO = ['activo', 'mantenimiento', 'fuera_servicio'];

export const seedAutobuses = async ({ models, conductores }, cantidad = 14) => {
  const { Autobus } = models;
  const autobuses = [];

  for (let i = 0; i < cantidad; i++) {
    const conductor = conductores.length
      ? conductores[i % conductores.length].id
      : null;

    const bus = await Autobus.create({
      placa: faker.string.alphanumeric({ length: 7 }).toUpperCase(),
      modelo: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      anio: faker.number.int({ min: 2008, max: 2024 }),
      capacidad: faker.number.int({ min: 30, max: 52 }),
      estado: ESTADO[i % ESTADO.length],
      conductorId: conductor, // hook valida que sea 'conductor'
    });
    autobuses.push(bus);
  }

  console.log(`🚌 Autobuses creados: ${autobuses.length}`);
  return autobuses;
};
