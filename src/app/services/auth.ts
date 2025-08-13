// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  // --- NUEVO: BehaviorSubjects para gestionar el estado en tiempo real ---
  // Un BehaviorSubject mantiene el último valor emitido.
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUser$ = new BehaviorSubject<any>(null);

  // Exponemos los estados como Observables públicos (de solo lectura)
  // El '$' al final es una convención para nombrar Observables.
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  currentUser$ = this._currentUser$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Al iniciar el servicio, comprueba si hay un token para mantener la sesión activa
    const token = localStorage.getItem('authToken');
    if (token) {
      // (En un futuro, aquí podrías validar el token contra el backend)
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this._isLoggedIn$.next(true);
      this._currentUser$.next(user);
    }
  }

  login(credentials: any): Observable<any> {
    const loginData = {
      correo_electronico: credentials.email,
      contrasena: credentials.password,
    };

    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        if (response && response.token && response.user) {
          // Guardamos el token Y los datos del usuario
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));

          // Notificamos a toda la app que el usuario ha iniciado sesión
          this._isLoggedIn$.next(true);
          this._currentUser$.next(response.user);
        }
      })
    );
  }

  logout(): void {
    // Limpiamos todo
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Notificamos a toda la app que la sesión se ha cerrado
    this._isLoggedIn$.next(false);
    this._currentUser$.next(null);

    // Redirigimos al login
    this.router.navigate(['/login']);
  }
}
