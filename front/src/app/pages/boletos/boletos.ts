import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';           // <-- IMPORTA ESTO
import { TicketsService, Viaje as Trip } from '../../services/tickets';

type SlotKey = 'madrugada' | 'manana' | 'tarde' | 'noche';

@Component({
  standalone: true,
  selector: 'app-boletos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './boletos.html',
  styleUrls: ['./boletos.scss'],
})
export class BoletosComponent {
  private route = inject(ActivatedRoute);
  private api = inject(TicketsService);

  // estado
  loading = true;
  error = '';
  origen = '';
  destino = '';
  fecha = '';

  // datos
  original: Trip[] = [];
  trips: Trip[] = [];

  // derivados para filtros
  empresas: string[] = [];
  clases: string[] = [];
  priceMin = 0;
  priceMax = 0;

  // filtros UI
  slotEnabled: Record<SlotKey, boolean> = {
    madrugada: true,
    manana: true,
    tarde: true,
    noche: true,
  };
  selectedClases = new Set<string>(); // vacío = todas
  selectedEmpresa: string = 'all'; // 'all' = todas
  priceMaxFilter = 0;
  sortBy: 'earliest' | 'cheapest' | 'fastest' = 'earliest';

  ngOnInit() {
    this.route.queryParamMap.subscribe((q) => {
      this.origen = q.get('origen') || '';
      this.destino = q.get('destino') || '';
      this.fecha = q.get('fecha') || '';
      this.fetch();
    });
  }

  fetch() {
    if (!this.origen || !this.destino || !this.fecha) return;
    this.loading = true;
    this.error = '';
    this.api.buscar(this.origen, this.destino, this.fecha).subscribe({
      next: (data) => {
        this.original = data ?? [];
        this.empresas = Array.from(
          new Set(this.original.map((t) => t.empresa))
        ).sort();
        this.clases = Array.from(
          new Set(this.original.map((t) => t.clase))
        ).sort();
        const precios = this.original.map((t) => t.precio);
        this.priceMin = precios.length ? Math.min(...precios) : 0;
        this.priceMax = precios.length ? Math.max(...precios) : 0;
        this.priceMaxFilter = this.priceMax;
        this.applyFilters();
        this.loading = false;
      },
      error: (_) => {
        this.error = 'No se pudo cargar la búsqueda.';
        this.loading = false;
      },
    });
  }

  // --- Helpers de filtro/orden ---
  private slotOf(dateIso: string): SlotKey {
    const h = new Date(dateIso).getHours();
    if (h < 5) return 'madrugada';
    if (h < 12) return 'manana';
    if (h < 18) return 'tarde';
    return 'noche';
  }

  private durMs(t: Trip): number {
    const s = new Date(t.salida).getTime();
    const l = t.llegada ? new Date(t.llegada).getTime() : NaN;
    return isNaN(l) ? Number.POSITIVE_INFINITY : Math.max(0, l - s);
  }

  durationStr(t: Trip): string {
    const ms = this.durMs(t);
    if (!isFinite(ms)) return '—';
    const m = Math.round(ms / 60000);
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m`;
  }

  toggleClase(c: string, checked: boolean) {
    if (checked) this.selectedClases.add(c);
    else this.selectedClases.delete(c);
    this.applyFilters();
  }

  applyFilters() {
    const enabledSlots = this.slotEnabled;
    const hasClaseFilter = this.selectedClases.size > 0;

    let list = this.original.filter((t) => {
      // horario
      const s = this.slotOf(t.salida);
      if (!enabledSlots[s]) return false;
      // empresa
      if (this.selectedEmpresa !== 'all' && t.empresa !== this.selectedEmpresa)
        return false;
      // clase
      if (hasClaseFilter && !this.selectedClases.has(t.clase)) return false;
      // precio
      if (t.precio > this.priceMaxFilter) return false;
      return true;
    });

    // ordenar
    if (this.sortBy === 'earliest') {
      list = list.sort((a, b) => +new Date(a.salida) - +new Date(b.salida));
    } else if (this.sortBy === 'cheapest') {
      list = list.sort((a, b) => a.precio - b.precio);
    } else if (this.sortBy === 'fastest') {
      list = list.sort((a, b) => this.durMs(a) - this.durMs(b));
    }

    this.trips = list;
  }

  // eventos UI
  onToggleSlot() {
    this.applyFilters();
  }
  onEmpresaChange(value: string) {
    this.selectedEmpresa = value;
    this.applyFilters();
  }
  onPriceChange(value: string | number) {
    this.priceMaxFilter = Number(value);
    this.applyFilters();
  }
  onSortChange(value: string) {
    this.sortBy = value as any;
    this.applyFilters();
  }

  seleccionar(t: Trip) {
    // Aquí puedes navegar a /checkout/:id
    console.log('Seleccionar viaje', t.id);
  }
}
