import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-skill-field',
  imports: [],
  templateUrl: './skill-field.html',
  styleUrl: './skill-field.css',
})
export class SkillField {
  @Input() skill: string = ''
}
