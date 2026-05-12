import {Component, Input} from '@angular/core';
import { IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-data-field',
  imports: [IonItem, IonLabel],
  templateUrl: './user-data-field.html',
  styleUrl: './user-data-field.css',
})
export class UserDataField {
  @Input() socialNetwork: string = ''
  @Input() title: string = ''
  @Input() link: string = ''
}
