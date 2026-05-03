import {Component, Input} from '@angular/core';
import {TopicBoxBtn} from '../topic-box-btn/topic-box-btn';
import {Topic} from '../../../core/models/topic.model';
import {EMPTY, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-user-skills',
  imports: [TopicBoxBtn],
  templateUrl: './user-skills.html',
  styleUrl: './user-skills.css',
})
export class UserSkills {
  @Input() label: string = 'Titulo de prueba'
  @Input() topics: Topic[] = [];
}
