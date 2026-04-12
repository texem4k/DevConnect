import {Component, Input} from '@angular/core';
import {TopicBoxBtn} from '../topic-box-btn/topic-box-btn';

@Component({
  selector: 'app-information-card',
  imports: [TopicBoxBtn],
  templateUrl: './information-card.html',
  styleUrl: './information-card.css',
})
export class InformationCard {
  @Input() imagen: string = ''
  @Input() titulo: string = ''
  @Input() descripcion: string = ''
}
