// src/app/pages/home/home.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RutasService } from '../../services/rutas';
import { of } from 'rxjs';
import { filter, switchMap, tap, catchError } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'], // asegúrate que coincide el nombre real del scss
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private rutasApi = inject(RutasService);

  form = this.fb.nonNullable.group({
    origen: [''],
    destino: [''],
    fecha: [new Date().toISOString().slice(0, 10)],
  });

  origenes: string[] = [];
  destinos: string[] = [];
  cargandoOrigenes = false;
  cargandoDestinos = false;
  minDate = new Date().toISOString().slice(0, 10);

  ngOnInit() {
    // Cargar ORÍGENES al entrar
    this.cargandoOrigenes = true;
    this.rutasApi
      .getOrigenes()
      .pipe(
        tap(() => console.log('[GET] /rutas/origenes')),
        catchError((err) => {
          console.error('Error cargando orígenes:', err);
          return of([] as string[]);
        })
      )
      .subscribe((data) => {
        this.origenes = data ?? [];
        this.cargandoOrigenes = false;
        console.log('Orígenes recibidos:', this.origenes);
      });

    // Cuando cambie ORIGEN, limpiar destino y pedir DESTINOS válidos
    this.form.controls.origen.valueChanges
      .pipe(
        tap((o) => {
          this.form.controls.destino.setValue('');
          this.destinos = [];
          console.log('Origen seleccionado:', o);
        }),
        filter((o): o is string => !!o),
        tap(() => (this.cargandoDestinos = true)),
        switchMap((o) =>
          this.rutasApi.getDestinos(o).pipe(
            tap(() => console.log(`[GET] /rutas/destinos?origen=${o}`)),
            catchError((err) => {
              console.error('Error cargando destinos:', err);
              return of([] as string[]);
            })
          )
        )
      )
      .subscribe((data) => {
        this.destinos = data ?? [];
        this.cargandoDestinos = false;
        console.log('Destinos recibidos:', this.destinos);
      });
  }

  buscar() {
    const { origen, destino, fecha } = this.form.getRawValue();
    if (!origen || !destino || !fecha) return;
    this.router.navigate(['/boletos'], {
      queryParams: { origen, destino, fecha },
    });
  }

  // Por si usas los botones de las tarjetas
  buscarDestino(dest: string) {
    const origen = this.form.value.origen || this.origenes[0] || '';
    const fecha =
      this.form.value.fecha || new Date().toISOString().slice(0, 10);
    if (!origen) return;
    this.router.navigate(['/boletos'], {
      queryParams: { origen, destino: dest, fecha },
    });
  }
  swap(){
  const { origen, destino } = this.form.getRawValue();
  this.form.patchValue({ origen: destino || '', destino: origen || '' });
}

}
