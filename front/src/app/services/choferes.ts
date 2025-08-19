import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export type EstadoChofer = 'apto' | 'revision' | 'no_apto';

export interface PersonaAPI {
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  documento_identidad?: string;
  tipo?: string;
}

export interface UsuarioAPI {
  id: number;
  correo_electronico?: string;
  estado?: string; // 'activo' | 'inactivo' (back)
  persona?: PersonaAPI;
}

export interface ChoferAPI {
  id: number;
  puesto: string;
  turno: string;
  fecha_ingreso: string;
  usuario?: {
    id: number;
    correo_electronico: string;
    estado: string;
    persona?: {
      nombre: string;
      primer_apellido: string;
      segundo_apellido: string;
      documento_identidad: string;
      tipo: string;
    };
  };
  // 🔹 nuevos que envía el back
  en_servicio?: 0 | 1 | boolean;
  viajes_mes?: number;
}

export interface ListaAPI<T> {
  success: boolean;
  data: T[];
  count?: number;
}

export interface RutaResumen {
  id: number;
  nombre: string;
}

export interface ChoferUI {
  id: number;
  nombre: string;
  correo?: string | null;
  estado: EstadoChofer;
  calificacion: number;
  rutaAsignada: RutaResumen | null;
  enServicio: boolean;
  viajesMes: number;
  avatarUrl?: string | null;
}

export interface Paged<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ChoferesService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api';

  /** Mapea 'activo'|'inactivo' del back a chip del front */
  private mapEstado(u?: UsuarioAPI): EstadoChofer {
    if (!u?.estado) return 'revision';
    return u.estado === 'activo' ? 'apto' : 'no_apto';
  }

  /** Calificación “estable” solo para demo (3.8 – 4.9) */
  private demoRating(id: number) {
    const seed = (id * 9301 + 49297) % 233280;
    return Math.round((3.8 + (seed / 233280) * 1.1) * 10) / 10;
  }

  /** En servicio demo (par/impar) */
  private demoEnServicio(id: number) {
    return id % 2 === 0;
  }

  private toUI(t: ChoferAPI): ChoferUI {
    const p = t.usuario?.persona as any;
    const nombre = p
      ? [p.nombre, p.primer_apellido, p.segundo_apellido]
          .filter(Boolean)
          .join(' ')
      : '—';

    return {
      id: t.id,
      nombre,
      estado: 'apto',
      calificacion: 4.0,
      rutaAsignada: null,
      enServicio: Boolean(1),
      viajesMes: Number(10),
      avatarUrl: null,
    };
  }

  listChoferesPaged(params?: {
    puesto?: string;
    turno?: string;
    page?: number;
    limit?: number;
  }): Observable<Paged<ChoferUI>> {
    const url = `${this.base}/trabajadores`;
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;

    return this.http
      .get<{
        success: boolean;
        page: number;
        pages: number;
        total: number;
        limit: number;
        data: ChoferAPI[];
      }>(url, {
        params: {
          ...(params?.puesto ? { puesto: params.puesto } : {}),
          ...(params?.turno ? { turno: params.turno } : {}),
          page,
          limit,
        } as any,
      })
      .pipe(
        map((r) => ({
          items: (r.data ?? []).map((x) => this.toUI(x)),
          page: r.page ?? page,
          pages: r.pages ?? 1,
          total: r.total ?? r.data?.length ?? 0,
          limit: r.limit ?? limit,
        })),
        catchError(() =>
          of({ items: [], page, pages: 1, total: 0, limit } as Paged<ChoferUI>)
        )
      );
  }

  /** Compat: si en algún lado sigues usando sin paginar */
  listChoferes(params?: {
    puesto?: string;
    turno?: string;
    page?: number;
    limit?: number;
  }): Observable<ChoferUI[]> {
    return this.listChoferesPaged(params).pipe(map((r) => r.items));
  }

  // (si tienes listRutas() aquí también)
  /*
  listChoferes(params?: {
    puesto?: string;
    turno?: string;
    page?: number;
    limit?: number;
  }): Observable<ChoferUI[]> {
    const url = `${this.base}/trabajadores`;
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;

    return this.http
      .get<ListaAPI<ChoferAPI>>(url, {
        params: {
          ...(params?.puesto ? { puesto: params.puesto } : {}),
          ...(params?.turno ? { turno: params.turno } : {}),
          page,
          limit,
        } as any,
      })
      .pipe(
        map((resp) =>
          (resp.data ?? []).map((t) => {
            const p = t.usuario?.persona;
            const nombre = p
              ? [p.nombre, p.primer_apellido, p.segundo_apellido]
                  .filter(Boolean)
                  .join(' ')
              : '—';
            return {
              id: t.id,
              nombre,
              correo: t.usuario?.correo_electronico ?? null,
              estado: this.mapEstado(t.usuario),
              calificacion: this.demoRating(t.id),
              rutaAsignada: null,
              enServicio: this.demoEnServicio(t.id),
              viajesMes: (t.id % 6) * 5,
              avatarUrl: null,
            } as ChoferUI;
          })
        ),
        catchError(() => of([]))
      );
  }*/

  /** Si ya tienes un endpoint real de rutas, úsalo; si no, esto devuelve [] sin romper la UI */
  listRutas(): Observable<RutaResumen[]> {
    const url = `${this.base}/rutas/resumen`; // ajusta si tu back difiere
    return this.http.get<ListaAPI<RutaResumen>>(url).pipe(
      map((r) => r.data ?? []),
      catchError(() => of([]))
    );
  }
}
