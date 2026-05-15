import {ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {AbstractControl, FormControl, ReactiveFormsModule} from '@angular/forms';
import { IonItem, IonLabel, IonInput, IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-get-input-text',
  imports: [ReactiveFormsModule, IonItem, IonLabel, IonInput, IonNote],
  templateUrl: './get-input-text.html',
  styleUrl: './get-input-text.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GetInputText {

  @Input() value: string | undefined;
  @Input() type: string='text';
  @Input() label: string = '';
  @Input() placeholder: string | undefined;
  @Input() control!: AbstractControl;
  @Input() errorMessages: Record<string, string> = {};
  @Input() participantsField: boolean | undefined;
  @Input() maxlength: string | number | null = null;

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  getErrorMessage(control: AbstractControl | null): string | null {
    if (!control || !control.errors) return null;

    for (const errorKey of Object.keys(control.errors)) {
      if (this.errorMessages[errorKey]) {
        return this.errorMessages[errorKey];
      }
    }

    return null;
  }

  protected readonly Number = Number;
}
