import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface ResumenIngresos {
  totales: { ingresos: number; gastos: number };
  mesActual: { ingresos: number; gastos: number; mesIndex: number };
  meses: { nombre: string; ganancias: number; gastos: number }[];
}

@Injectable({ providedIn: 'root' })
export class IngresosService {
  /**
   * Genera datos con estacionalidad (ENE bajo, JUL/AGO altos, DIC pico),
   * una relación gastos/ingresos razonable y una tendencia anual ligera.
   * Usa un seed para obtener resultados reproducibles.
   */
  resumen(year: number, seed?: number): Observable<ResumenIngresos> {
    const s = seed ?? year * 100 + (new Date().getMonth() + 1);
    const data = mockResumen(year, s);
    return of(data).pipe(delay(450)); // pequeña latencia para sensación de carga
  }
}

/* ------------------ Helpers de simulación ------------------ */

// PRNG determinista (reproducible)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

// Pesos estacionales (ajústalos si quieres otra curva)
const SEASON = [
  0.86, // Ene (bajo post-fiestas)
  0.9, // Feb
  0.97, // Mar
  1.02, // Abr (semana santa puede caer aquí o en mar)
  1.08, // May
  1.18, // Jun
  1.25, // Jul (vacaciones)
  1.22, // Ago
  0.96, // Sep
  1.02, // Oct
  1.1, // Nov (puentes)
  1.35, // Dic (pico)
];

function mockResumen(year: number, seed: number): ResumenIngresos {
  const rand = mulberry32(seed);

  // Tendencia anual ligera (ej. +3% por cada año por encima de 2024)
  const trend = 1 + Math.max(0, year - 2024) * 0.03;

  // Ingreso base mensual “medio” (ajústalo a tu escala)
  const baseIngreso = 300_000;

  // Gastos fijos mensuales aproximados
  const gastosFijos = 35_000;

  // Generamos 12 meses
  const meses = MESES.map((nombre, i) => {
    // variación aleatoria controlada ±10%
    const jitter = 0.9 + 0.2 * rand();

    // ingreso mensual con estacionalidad + tendencia + jitter
    const ingreso = Math.round(baseIngreso * SEASON[i] * trend * jitter);

    // gastos variables ~ 62–78% del ingreso (más fijos); cap a 92% del ingreso
    const ratioVar = 0.62 + 0.16 * rand();
    const gastosRaw = Math.round(ingreso * ratioVar + gastosFijos);
    const gastos = Math.min(gastosRaw, Math.round(ingreso * 0.92));

    return { nombre, ganancias: ingreso, gastos };
  });

  const totIng = meses.reduce((s, m) => s + m.ganancias, 0);
  const totGas = meses.reduce((s, m) => s + m.gastos, 0);
  const mesIndex = new Date().getMonth();

  return {
    totales: { ingresos: totIng, gastos: totGas },
    mesActual: {
      ingresos: meses[mesIndex]?.ganancias ?? 0,
      gastos: meses[mesIndex]?.gastos ?? 0,
      mesIndex,
    },
    meses,
  };
}
