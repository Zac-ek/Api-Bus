import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RutasService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api/rutas';

  getOrigenes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/origenes`);
  }

  getDestinos(origen: string): Observable<string[]> {
    const params = new HttpParams().set('origen', origen);
    return this.http.get<string[]>(`${this.base}/destinos`, { params });
  }
}
