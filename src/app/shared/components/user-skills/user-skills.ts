import {Component, Input} from '@angular/core';
import {TopicBoxBtn} from '../topic-box-btn/topic-box-btn';

@Component({
  selector: 'app-user-skills',
  imports: [TopicBoxBtn],
  templateUrl: './user-skills.html',
  styleUrl: './user-skills.css',
})
export class UserSkills {
  @Input() label: string = 'Titulo de prueba'
  @Input() topics: string[]=[]
}
