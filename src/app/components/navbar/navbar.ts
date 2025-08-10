import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout() {
    // Aquí iría la lógica para limpiar el estado de la sesión
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}
