import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { MainLayoutComponent } from './layouts/main/main';
import { HomeComponent } from './pages/home/home';
import { BoletosComponent } from './pages/boletos/boletos'; // <-- NUEVO

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'boletos', component: BoletosComponent }, // <-- NUEVO
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
