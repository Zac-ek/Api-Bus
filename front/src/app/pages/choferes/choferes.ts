// src/app/pages/choferes/choferes.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  ChoferesService,
  ChoferUI,
  RutaResumen,
} from '../../services/choferes';

@Component({
  standalone: true,
  selector: 'app-choferes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './choferes.html',
  styleUrls: ['./choferes.scss'],
})
export class ChoferesComponent {
  private api = inject(ChoferesService);
  private fb = inject(FormBuilder);

  readonly PAGE_LIMIT = 50;

  loading = true;
  loadingMore = false;
  error = '';

  // datos
  choferes: ChoferUI[] = [];
  filtrados: ChoferUI[] = [];
  rutas: RutaResumen[] = [];

  // paginación
  page = 1;
  pages = 1;
  total = 0;

  // KPIs
  kpiActivos = 0;
  kpiServicio = 1;
  kpiDescanso = 0;

  form = this.fb.group({
    q: [''],
    turno: [''],
    estado: [''], // <- si tu template lo usa
    rutaId: [null as number | null],
    ratingMin: [0],
    sortBy: ['nombre' as 'nombre' | 'rating' | 'viajes'],
  });

  ngOnInit() {
    // si usas rutas
    // this.api.listRutas().subscribe((r) => (this.rutas = r));

    this.loadFirstPage();
    this.form.valueChanges.subscribe(() => this.applyFilters());
  }

  /** Carga la primera página (resetea el listado) */
  loadFirstPage() {
    this.loading = true;
    this.error = '';
    this.page = 1;

    this.api
      .listChoferesPaged({ page: this.page, limit: this.PAGE_LIMIT })
      .subscribe({
        next: (r) => {
          this.choferes = r.items;
          this.page = r.page;
          this.pages = r.pages;
          this.total = r.total;
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar choferes';
          this.loading = false;
        },
      });
  }

  /** Carga la siguiente página y concatena */
  loadMore() {
    if (this.loadingMore || this.page >= this.pages) return;
    this.loadingMore = true;

    this.api
      .listChoferesPaged({ page: this.page + 1, limit: this.PAGE_LIMIT })
      .subscribe({
        next: (r) => {
          this.page = r.page;
          this.pages = r.pages;
          this.total = r.total;

          // concat
          this.choferes = [...this.choferes, ...r.items];

          this.applyFilters();
          this.loadingMore = false;
        },
        error: () => {
          this.loadingMore = false;
        },
      });
  }

  private applyFilters() {
    const { q, rutaId, sortBy, ratingMin, estado } = this.form.getRawValue();
    let list = this.choferes.slice();

    if (q) {
      const term = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.nombre.toLowerCase().includes(term) ||
          (c as any).correo?.toLowerCase?.().includes(term)
      );
    }

    if (estado) {
      list = list.filter((c) => c.estado === estado);
    }

    if (rutaId) {
      list = list.filter((c) => (c as any).rutaAsignada?.id === rutaId);
    }

    if ((ratingMin ?? 0) > 0) {
      list = list.filter((c) => c.calificacion >= Number(ratingMin));
    }

    if (sortBy === 'nombre')
      list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (sortBy === 'rating')
      list.sort((a, b) => b.calificacion - a.calificacion);
    if (sortBy === 'viajes') list.sort((a, b) => b.viajesMes - a.viajesMes);

    this.filtrados = list;

    this.kpiActivos = list.filter((c) => c.estado === 'apto').length;
    this.kpiServicio = list.filter((c) => c.enServicio).length;
    this.kpiDescanso = list.filter((c) => !c.enServicio).length;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]!.toUpperCase())
      .join('');
  }

  estadoChip(estado: ChoferUI['estado']) {
    return {
      chip: true,
      'chip--ok': estado === 'apto',
      'chip--warn': estado === 'revision',
      'chip--bad': estado === 'no_apto',
    };
  }

  trackById = (_: number, c: ChoferUI) => c.id;
}
