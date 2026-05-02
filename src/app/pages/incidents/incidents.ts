import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import { User } from '@angular/fire/auth';
import {AuthService} from '../../core/services/auth-service';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Footer, Header],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class Incidents implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private firestore   = inject(Firestore);
  private cdr         = inject(ChangeDetectorRef);

  currentUser: User | null = null;
  isSubmitting             = false;
  notLoggedMessage         = '';
  successMessage           = '';

  private userSub!: Subscription;

  incidentsForm = new FormGroup({
    topic: new FormControl<string>('', { nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]
    }),
    text: new FormControl<string>('', { nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(1000),
      ]
    }),
  });

  get topic() { return this.incidentsForm.get('topic') as FormControl; }
  get text()  { return this.incidentsForm.get('text')  as FormControl; }

  get topicError(): string {
    const control = this.incidentsForm.get('topic');
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required'])  return 'El asunto es obligatorio.';
      if (control.errors?.['minlength']) return 'El asunto debe tener al menos 5 caracteres.';
      if (control.errors?.['maxlength']) return 'El asunto no puede superar los 100 caracteres.';
    }
    return '';
  }

  get textError(): string {
    const control = this.incidentsForm.get('text');
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required'])  return 'La descripción es obligatoria.';
      if (control.errors?.['minlength']) return 'La descripción debe tener al menos 100 caracteres.';
      if (control.errors?.['maxlength']) return 'La descripción no puede superar los 1000 caracteres.';
    }
    return '';
  }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) this.notLoggedMessage = '';
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  async submitIncident(): Promise<void> {
    this.notLoggedMessage = '';
    this.successMessage   = '';

    if (!this.currentUser) {
      this.notLoggedMessage = 'Debes iniciar sesión para enviar un reporte.';
      return;
    }

    if (this.incidentsForm.invalid) {
      this.incidentsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      await addDoc(collection(this.firestore, 'incidents'), {
        userId:    this.currentUser.uid,
        userEmail: this.currentUser.email,
        asunto:    this.topic.value,
        text:      this.text.value,
        createdAt: Timestamp.now(),
        status:    'pending',
      });

      this.successMessage = '¡Reporte enviado correctamente!';
      setTimeout(() => this.successMessage = '', 3000);
      this.incidentsForm.reset();
    } catch (error: any) {
      this.notLoggedMessage = 'Ocurrió un error al enviar el reporte. Inténtalo de nuevo.';
      console.error('Error al guardar la incidencia:', error);
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }
}
