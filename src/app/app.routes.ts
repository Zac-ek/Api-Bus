// src/app/app.routes.ts

import { Routes } from '@angular/router';

// Importamos los componentes necesarios
import { LoginComponent } from './auth/login/login';
import { MainLayoutComponent } from './layouts/main/main';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  // Ruta para la vista de login (no tiene layout principal)
  {
    path: 'login',
    component: LoginComponent,
  },

  // Rutas que usarán el layout principal (con Navbar y Footer)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      // Aquí irán otras rutas como 'mis-viajes', 'perfil', etc.

      // Redirige la ruta raíz (ej: localhost:4200) a '/home'
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  // Opcional: Redirigir cualquier ruta no encontrada a la página de inicio
  { path: '**', redirectTo: 'home' },
];
