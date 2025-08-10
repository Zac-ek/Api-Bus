// seeders/helpers.js
import { faker } from '@faker-js/faker';

export const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

export const randHora = (hMin = 5, hMax = 22) => {
  const h = faker.number.int({ min: hMin, max: hMax });
  const m = faker.number.int({ min: 0, max: 59 });
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
};

export const addMinutesHHMMSS = (hhmmss, minutes) => {
  const [h, m] = hhmmss.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  d.setMinutes(d.getMinutes() + minutes);
  const H = String(d.getHours()).padStart(2, '0');
  const M = String(d.getMinutes()).padStart(2, '0');
  return `${H}:${M}:00`;
};

export const randDateWithin = (daysAhead = 30) => {
  const d = new Date();
  d.setDate(d.getDate() + faker.number.int({ min: 1, max: daysAhead }));
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};
