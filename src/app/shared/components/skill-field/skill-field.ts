import {Component, Input} from '@angular/core';
import { IonChip, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-skill-field',
  imports: [IonChip, IonLabel],
  templateUrl: './skill-field.html',
  styleUrl: './skill-field.css',
})
export class SkillField {
  @Input() skill: string = ''
}
