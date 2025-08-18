// src/app/pages/asientos/asientos.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { TicketsService, SeatMap, Seat } from '../../services/tickets';

@Component({
  standalone: true,
  selector: 'app-asientos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './asientos.html',
  styleUrls: ['./asientos.scss'],
})
export class AsientosComponent {
  private route = inject(ActivatedRoute);
  private api = inject(TicketsService);

  tripId = '';
  precio = 0;
  origen = '';
  destino = '';
  salida = '';
  llegada = '';

  loading = true;
  error = '';
  seatmap: SeatMap | null = null; // 👈 antes era `seatmap!: SeatMap`
  selected: number[] = [];
  pasajeros = 1;
  maxSel = 6;

  ngOnInit() {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([p, q]) => {
        this.tripId = p.get('id') || '';
        this.precio = +(q.get('precio') || 0);
        this.origen = q.get('origen') || '';
        this.destino = q.get('destino') || '';
        this.salida = q.get('salida') || '';
        this.llegada = q.get('llegada') || '';
        if (this.tripId) this.fetch();
      }
    );
  }

  fetch() {
    this.loading = true;
    this.error = '';
    this.api.getAsientos(this.tripId).subscribe({
      next: (data: SeatMap) => {
        this.seatmap = data;
        this.loading = false;
      },
      error: (e: any) => {
        console.error(e);
        this.error = 'No se pudo cargar el mapa de asientos.';
        this.loading = false;
      },
    });
  }

  // trackBy correcto
  seatTrack(index: number, s: Seat) {
    return `${s.row}-${s.col}`;
  }

  toggle(s: Seat) {
    if (s.status !== 'free' && s.status !== 'pref') return;
    const i = this.selected.indexOf(s.num);
    if (i >= 0) this.selected.splice(i, 1);
    else if (this.selected.length < this.maxSel) this.selected.push(s.num);
  }

  isSelected(n: number) {
    return this.selected.includes(n);
  }
  total() {
    return this.selected.length * this.precio;
  }
  onPaxChange(n: number) {
    this.pasajeros = Number(n);
    if (this.selected.length > this.pasajeros)
      this.selected = this.selected.slice(0, this.pasajeros);
  }
  canContinue() {
    return (
      !this.loading && !this.error && this.selected.length === this.pasajeros
    );
  }

  // 👇 Cálculo de duración (evita `new Date()` en el template)
  duracion(): string {
    if (!this.salida || !this.llegada) return '—';
    const s = new Date(this.salida).getTime();
    const l = new Date(this.llegada).getTime();
    if (isNaN(s) || isNaN(l) || l <= s) return '—';
    return `${((l - s) / 3_600_000).toFixed(1)} h`;
  }

  continuar() {
    console.log('asientos', this.selected);
  }
}
