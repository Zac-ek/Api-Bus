import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { MainLayoutComponent } from './layouts/main/main';
import { HomeComponent } from './pages/home/home';
import { BoletosComponent } from './pages/boletos/boletos'; // <-- NUEVO
import { AdminLayoutComponent } from './layouts/admin/admin';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { IngresosComponent } from './pages/ingresos/ingresos';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'boletos', component: BoletosComponent }, // <-- NUEVO
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'asientos/:id',
        loadComponent: () =>
          import('./pages/asientos/asientos').then((c) => c.AsientosComponent),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // (a futuro) viajes/boletos/...
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'choferes',
        loadComponent: () =>
          import('./pages/choferes/choferes').then((c) => c.ChoferesComponent),
      },
      {path: 'ingresos', component: IngresosComponent },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
