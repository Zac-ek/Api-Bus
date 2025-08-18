import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class AdminLayoutComponent {
  collapsed = true; // ← oculto por defecto
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
