import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import { GetInputText } from '../../shared/components/get-input-text/get-input-text';
import { IonContent, IonTextarea, IonButton, IonNote, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Footer, Header, GetInputText, IonContent, IonTextarea, IonButton, IonNote, IonLabel],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class Incidents {
  private firestore = inject(Firestore);
  private cdr       = inject(ChangeDetectorRef);

  isSubmitting   = false;
  errorMessage   = '';
  successMessage = '';

  incidentsForm = new FormGroup({
    topic: new FormControl<string>('', { nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]
    }),
    email: new FormControl<string>('', { nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
      ]
    }),
    text: new FormControl<string>('', { nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(1000),
      ]
    }),
  });

  get topic() { return this.incidentsForm.get('topic') as FormControl; }
  get email() { return this.incidentsForm.get('email') as FormControl; }
  get text()  { return this.incidentsForm.get('text')  as FormControl; }

  get topicError(): string {
    const control = this.incidentsForm.get('topic');
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required'])  return 'El asunto es obligatorio.';
      if (control.errors?.['minlength']) return 'El asunto debe tener al menos 5 caracteres.';
      if (control.errors?.['maxlength']) return 'El asunto no puede superar los 50 caracteres.';
    }
    return '';
  }

  get emailError(): string {
    const control = this.incidentsForm.get('email');
    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) return 'El correo es obligatorio.';
      if (control.errors?.['email'])    return 'Introduce un correo válido.';
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

  async submitIncident(): Promise<void> {
    this.errorMessage  = '';
    this.successMessage = '';

    if (this.incidentsForm.invalid) {
      this.incidentsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      await addDoc(collection(this.firestore, 'incidents'), {
        userEmail: this.email.value,
        asunto:    this.topic.value,
        text:      this.text.value,
        createdAt: Timestamp.now(),
        status:    'pending',
      });

      this.successMessage = '¡Reporte enviado correctamente!';
      setTimeout(() => this.successMessage = '', 3000);
      this.incidentsForm.reset();
    } catch (error: any) {
      this.errorMessage = 'Ocurrió un error al enviar el reporte. Inténtalo de nuevo.';
      console.error('Error al guardar la incidencia:', error);
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }
}
