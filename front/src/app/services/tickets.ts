import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Viaje {
  id: string;
  rutaId: number;
  origen: string;
  destino: string;
  salida: string;
  llegada: string | null;
  precio: number;
  empresa: string;
  clase: string;
  asientosDisponibles: number;
}

export type SeatStatus = 'free' | 'taken' | 'blocked' | 'pref';
export interface Seat {
  num: number;
  row: number;
  col: number;
  status: SeatStatus;
}
export interface SeatMap {
  tripId: string;
  busType: string; // p.ej. '2+2'
  rows: number;
  cols: number;
  aisleAfter: number;
  seats: Seat[];
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api';

  buscar(origen: string, destino: string, fecha: string): Observable<Viaje[]> {
    const params = new HttpParams()
      .set('origen', origen)
      .set('destino', destino)
      .set('fecha', fecha);
    return this.http.get<Viaje[]>(`${this.base}/viajes`, { params });
  }

  getCiudades(): Observable<{ origins: string[]; destinations: string[] }> {
    return this.http.get<{ origins: string[]; destinations: string[] }>(
      `${this.base}/rutas/ciudades`
    );
  }

  getAsientos(tripId: string): Observable<SeatMap> {
    return this.http.get<SeatMap>(
      `${this.base}/viajes/${encodeURIComponent(tripId)}/asientos`
    );
  }
}
