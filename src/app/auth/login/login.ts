import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
  query,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
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
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  // ¡ESTA LÍNEA ES LA CORRECCIÓN!
  // Al declarar 'private router: Router' aquí, Angular nos da acceso al servicio de rutas.
  constructor(private router: Router) {
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

  toggleView() {
    this.isLoginView = !this.isLoginView;
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      // Ahora 'this.router' existe y podemos usarlo para navegar.
      this.router.navigate(['/home']);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Register data:', this.registerForm.value);
      // Podrías también navegar al home después de un registro exitoso.
      this.router.navigate(['/home']);
    }
  }
}
