import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type PuntoMes = { mes: string; ingresos: number; gastos: number };
type ResumenIngresos = {
  totales: { ingresos: number; gastos: number };
  mesActual: { ingresos: number; gastos: number };
  serie: PuntoMes[];
};

@Component({
  standalone: true,
  selector: 'app-ingresos',
  imports: [CommonModule],
  templateUrl: './ingresos.html',
  styleUrls: ['./ingresos.scss'],
})
export class IngresosComponent implements AfterViewInit {
  @ViewChild('chartRef') chartRef!: ElementRef<HTMLCanvasElement>;

  loading = false;
  error = '';
  resumen: ResumenIngresos | null = null;

  private chart: Chart | null = null;

  ngOnInit() {
    // Simulación de datos realistas (tendencia suave + ruido)
    this.resumen = this.simularDatos();
  }

  ngAfterViewInit() {
    // Dibuja la gráfica cuando el canvas ya existe
    this.renderChart();
  }

  // -----------------------------
  // Simulador de ingresos/gastos
  // -----------------------------
  private simularDatos(): ResumenIngresos {
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    // Empezamos con una base y la hacemos crecer ligeramente mes a mes
    let base = 220_000 + Math.random() * 80_000;

    const serie: PuntoMes[] = meses.map((m, i) => {
      // tendencia creciente + ruido
      const ingresos = Math.max(
        0,
        base + i * 18_000 + this.rand(-15_000, 25_000)
      );
      // gastos ~ 55–75% de ingresos (con ruido)
      const gastos = Math.max(
        0,
        ingresos * (0.55 + Math.random() * 0.2) + this.rand(-8_000, 8_000)
      );
      return {
        mes: m,
        ingresos: Math.round(ingresos),
        gastos: Math.round(gastos),
      };
    });

    const totIng = serie.reduce((s, p) => s + p.ingresos, 0);
    const totGas = serie.reduce((s, p) => s + p.gastos, 0);
    const actual = serie[new Date().getMonth()];

    return {
      totales: { ingresos: totIng, gastos: totGas },
      mesActual: { ingresos: actual.ingresos, gastos: actual.gastos },
      serie,
    };
  }

  private rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // -----------------------------
  // Chart.js
  // -----------------------------
  private renderChart() {
    if (!this.chartRef || !this.resumen) return;

    const labels = this.resumen.serie.map((p) => p.mes);
    const datasetIngresos = this.resumen.serie.map((p) => p.ingresos);
    const datasetGastos = this.resumen.serie.map((p) => p.gastos);

    // Destruir si ya existe para evitar fugas
    this.chart?.destroy();

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Ganancias',
            data: datasetIngresos,
            borderWidth: 0,
            backgroundColor: 'rgba(34,197,94,0.8)', // verde
            hoverBackgroundColor: 'rgba(34,197,94,1)',
          },
          {
            label: 'Gastos',
            data: datasetGastos,
            borderWidth: 0,
            backgroundColor: 'rgba(59,130,246,0.75)', // azul
            hoverBackgroundColor: 'rgba(59,130,246,1)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // importante para que llene el contenedor
        plugins: {
          legend: {
            labels: { color: '#cfe2ff' },
          },
          tooltip: {
            callbacks: {
              label(ctx) {
                const v = ctx.parsed.y ?? 0;
                return `${ctx.dataset.label}: $${v.toLocaleString('es-MX')}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#cfe2ff' },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: {
              color: '#cfe2ff',
              callback(value) {
                return `$${Number(value).toLocaleString('es-MX')}`;
              },
            },
          },
        },
      },
    });
  }
}
