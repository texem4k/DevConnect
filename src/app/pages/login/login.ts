import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Auth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence} from '@angular/fire/auth';
import {GetInputText} from '../../shared/components/get-input-text/get-input-text';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, GetInputText, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef)

  loading = false;
  generalError = '';

  loginForm = new FormGroup({
    email: new FormControl('', {nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
    ]}),
    password: new FormControl('', {nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|\\:;"'<>,.?\/]).+$/)
      ]})
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  goBack() {
    this.router.navigate(['/']);
  }

  async login() {
    this.generalError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {

      await setPersistence(this.auth, browserLocalPersistence);

      await signInWithEmailAndPassword(
        this.auth,
        this.email?.value!,
        this.password?.value!
      );

      await this.router.navigate(['/']);
    } catch (error: any) {
      this.handleError(error.code);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }


  private handleError(code: string) {
    const messages: Record<string, string> = {
      'auth/user-not-found':     'No existe una cuenta con ese correo.',
      'auth/invalid-email':      'El formato del correo no es válido.',
      'auth/wrong-password':     'Contraseña incorrecta.',
      'auth/invalid-credential': 'Correo o contraseña incorrectos.',
      'auth/too-many-requests':  'Demasiados intentos. Inténtalo más tarde.',
    };
    this.generalError = messages[code] || 'Error al iniciar sesión. Inténtalo de nuevo.';
  }
}
