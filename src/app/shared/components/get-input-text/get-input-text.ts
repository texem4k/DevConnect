import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule , FormsModule} from '@angular/forms';

@Component({
  selector: 'app-get-input-text',
  imports: [ReactiveFormsModule , FormsModule],
  templateUrl: './get-input-text.html',
  styleUrl: './get-input-text.css',
})
export class GetInputText {
  @Input() titulo = '';
  @Input() id = '';
  @Input() type = 'text'
  @Input() placeholder = '';
  @Input() control!: FormControl;
}
