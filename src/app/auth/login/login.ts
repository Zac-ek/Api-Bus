// src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
  group,
  query,
} from '@angular/animations';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // IMPORTANTE: ReactiveFormsModule debe estar aquí
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  animations: [
    trigger('formAnimation', [
      transition('login => register', [
        group([
          query(
            ':leave',
            [
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(-100%)', opacity: 0 })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({ transform: 'translateX(100%)', opacity: 0 }),
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(0%)', opacity: 1 })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition('register => login', [
        group([
          query(
            ':leave',
            [
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(100%)', opacity: 0 })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({ transform: 'translateX(-100%)', opacity: 0 }),
              animate(
                '0.5s ease-in-out',
                style({ transform: 'translateX(0%)', opacity: 1 })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class LoginComponent {
  isLoginView = true;
  loginForm: FormGroup; // No usar '!' para asegurar la inicialización en el constructor
  registerForm: FormGroup;
  loginError: string | null = null;
  registerError: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
    // Definimos los formularios DENTRO del constructor
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    this.registerForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginError = null;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        console.error(err);
        this.loginError = 'Credenciales incorrectas.';
      },
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.registerError = null;
    console.log('Datos de registro:', this.registerForm.value);
    // Aquí iría la llamada a authService.register(...)
    this.router.navigate(['/dashboard']);
  }
}
