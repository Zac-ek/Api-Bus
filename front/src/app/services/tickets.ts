import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Viaje {
  id: string;
  rutaId: number;
  origen: string;
  destino: string;
  salida: string;
  llegada: string;
  precio: number;
  empresa: string;
  clase: string;
  asientosDisponibles: number;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api';

  buscar(origen: string, destino: string, fecha: string) {
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
}
