// src/app/components/navbar/navbar.component.ts

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';

// --- 1. Importa CommonModule y RouterModule ---
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // --- 2. Añade los módulos al array de imports ---
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<any>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
