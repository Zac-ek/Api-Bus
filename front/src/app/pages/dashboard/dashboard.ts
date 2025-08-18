import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration } from 'chart.js';
import 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  // KPIs
  viajes = 1532;
  boletos = 10921;
  ingresos = 45000;

  // Barras: lugares e ingresos
  barData: ChartConfiguration<'bar'>['data'] = {
    labels: ['El Tajín', 'Veracruz', 'Puebla', 'Orizaba', 'Córdoba'],
    datasets: [{ data: [42000, 48500, 52500, 59000, 68000] }],
  };
  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#b7c9e6' } },
      y: {
        grid: { color: 'rgba(255,255,255,.08)' },
        ticks: { color: '#b7c9e6' },
      },
    },
  };

  // Línea: choferes con más viajes
  lineData: ChartConfiguration<'line'>['data'] = {
    labels: ['Juan', 'Manuel', 'Carlos', 'Antonio', 'Luis'],
    datasets: [
      {
        data: [310, 289, 265, 241, 225],
        tension: 0.35,
        fill: false,
      },
    ],
  };
  lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#b7c9e6' } },
      y: {
        grid: { color: 'rgba(255,255,255,.08)' },
        ticks: { color: '#b7c9e6' },
      },
    },
    elements: { point: { radius: 4 } },
  };

  // Dona: asistencia
  doughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Asistió', 'Permiso', 'Ausente'],
    datasets: [{ data: [85, 5, 10] }],
  };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '60%',
    plugins: { legend: { position: 'bottom', labels: { color: '#cfe2ff' } } },
  };

  // Tabla choferes
  choferes = [
    {
      nombre: 'Manuel Perez',
      viajes: 289,
      rating: 4.5,
      eval: 4.5,
      estado: 'Apto',
    },
    {
      nombre: 'Juan Rodríguez',
      viajes: 295,
      rating: 4.2,
      eval: 4.2,
      estado: 'Rev',
    },
    {
      nombre: 'Carlos Lopez',
      viajes: 241,
      rating: 4.0,
      eval: 4.0,
      estado: 'No',
    },
    { nombre: 'Pedro Díaz', viajes: 228, rating: 4.1, eval: 4.1, estado: 'No' },
    {
      nombre: 'Antonio Gómez',
      viajes: 265,
      rating: 4.6,
      eval: 4.6,
      estado: 'Apto',
    },
  ];
}
