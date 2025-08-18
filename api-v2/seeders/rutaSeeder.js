// seeders/rutaSeeder.js
import { faker } from '@faker-js/faker';

// Catálogo de ciudades de México con coordenadas (WGS84)
const MX_CITIES = [
  { name: 'Ciudad de México', lat: 19.432608, lon: -99.133209 },
  { name: 'Guadalajara', lat: 20.659699, lon: -103.349609 },
  { name: 'Monterrey', lat: 25.686614, lon: -100.316113 },
  { name: 'Puebla', lat: 19.041297, lon: -98.206200 },
  { name: 'Toluca', lat: 19.282609, lon: -99.655663 },
  { name: 'Querétaro', lat: 20.588793, lon: -100.389888 },
  { name: 'León', lat: 21.122070, lon: -101.676880 },
  { name: 'San Luis Potosí', lat: 22.156469, lon: -100.985540 },
  { name: 'Aguascalientes', lat: 21.885256, lon: -102.291567 },
  { name: 'Morelia', lat: 19.700780, lon: -101.184430 },
  { name: 'Zacatecas', lat: 22.770924, lon: -102.583253 },
  { name: 'Guanajuato', lat: 21.019014, lon: -101.257360 },
  { name: 'Tijuana', lat: 32.514947, lon: -117.038247 },
  { name: 'Mexicali', lat: 32.624538, lon: -115.452262 },
  { name: 'Ensenada', lat: 31.866742, lon: -116.596371 },
  { name: 'La Paz', lat: 24.142640, lon: -110.312753 },
  { name: 'Hermosillo', lat: 29.072967, lon: -110.955919 },
  { name: 'Culiacán', lat: 24.809064, lon: -107.394001 },
  { name: 'Mazatlán', lat: 23.249415, lon: -106.411142 },
  { name: 'Durango', lat: 24.027720, lon: -104.653175 },
  { name: 'Chihuahua', lat: 28.632996, lon: -106.069100 },
  { name: 'Ciudad Juárez', lat: 31.690363, lon: -106.424547 },
  { name: 'Torreón', lat: 25.542844, lon: -103.406786 },
  { name: 'Saltillo', lat: 25.423210, lon: -101.005301 },
  { name: 'Tampico', lat: 22.255288, lon: -97.868927 },
  { name: 'Reynosa', lat: 26.092197, lon: -98.277645 },
  { name: 'Matamoros', lat: 25.869029, lon: -97.502737 },
  { name: 'Veracruz', lat: 19.173773, lon: -96.134224 },
  { name: 'Xalapa', lat: 19.543775, lon: -96.910217 },
  { name: 'Coatzacoalcos', lat: 18.143444, lon: -94.419994 },
  { name: 'Villahermosa', lat: 17.989456, lon: -92.947506 },
  { name: 'Tuxtla Gutiérrez', lat: 16.753283, lon: -93.115997 },
  { name: 'Oaxaca', lat: 17.073185, lon: -96.726588 },
  { name: 'Acapulco', lat: 16.853109, lon: -99.823653 },
  { name: 'Chilpancingo', lat: 17.552146, lon: -99.501571 },
  { name: 'Cuernavaca', lat: 18.924209, lon: -99.221565 },
  { name: 'Cancún', lat: 21.161908, lon: -86.851528 },
  { name: 'Playa del Carmen', lat: 20.629559, lon: -87.073885 },
  { name: 'Mérida', lat: 20.967370, lon: -89.592586 },
  { name: 'Campeche', lat: 19.830125, lon: -90.534908 },
  { name: 'Chetumal', lat: 18.500120, lon: -88.297140 },
  { name: 'Tepic', lat: 21.505804, lon: -104.894608 },
  { name: 'Colima', lat: 19.245234, lon: -103.724036 },
  { name: 'Manzanillo', lat: 19.113807, lon: -104.342140 },
  { name: 'Puerto Vallarta', lat: 20.653408, lon: -105.225331 },
  { name: 'Los Cabos', lat: 22.890532, lon: -109.916737 },
];

// Haversine para distancia en km
function haversineKm(a, b) {
  const R = 6371; // km
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export const seedRutas = async ({ models, autobuses }, cantidad = 30) => {
  const { Ruta } = models;
  const rutas = [];
  const usados = new Set(); // para evitar nombres duplicados

  for (let i = 0; i < cantidad; i++) {
    // Elegimos dos ciudades distintas
    const a = MX_CITIES[faker.number.int({ min: 0, max: MX_CITIES.length - 1 })];
    let b;
    do {
      b = MX_CITIES[faker.number.int({ min: 0, max: MX_CITIES.length - 1 })];
    } while (b.name === a.name);

    const nombreRuta = `${a.name} - ${b.name}`;
    if (usados.has(nombreRuta)) {
      i--; // reintentar esta iteración para evitar duplicado
      continue;
    }
    usados.add(nombreRuta);

    // Distancia realista (Haversine) con pequeño ruido
    let distancia = haversineKm(a, b);
    if (!Number.isFinite(distancia) || distancia <= 0) {
      // Fallback seguro
      distancia = faker.number.float({ min: 5, max: 800, precision: 0.01 });
    } else {
      // agregar una variación leve (±5%) para que no sea “perfecta”
      const factor = faker.number.float({ min: 0.95, max: 1.05, precision: 0.0001 });
      distancia = Math.max(5, distancia * factor);
    }
    const distancia_km = Number(distancia.toFixed(2));

    // Tiempo estimado: ~80 km/h en carretera, mínimo 20 min
    const horas = distancia_km / 80;
    const tiempo_estimado_seg = Math.max(20 * 60, Math.round(horas * 3600));

    // Asignar autobús aleatorio
    const bus = autobuses[faker.number.int({ min: 0, max: autobuses.length - 1 })];

    const r = await Ruta.create({
      nombre: nombreRuta,
      punto_inicio: a.name,
      punto_final: b.name,
      distancia_km,
      tiempo_estimado_seg,
      autobus_asignadoId: bus.id,
      activo: true,
    });

    rutas.push(r);
  }

  console.log(`🗺️ Rutas creadas (MX): ${rutas.length}`);
  return rutas;
};
