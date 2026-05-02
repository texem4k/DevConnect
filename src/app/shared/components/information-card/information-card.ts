import {Component, inject, Input} from '@angular/core';
import { TopicBoxBtn } from '../topic-box-btn/topic-box-btn';
import { Router } from '@angular/router';
import {Topic} from '../../../core/models/topic.model';

@Component({
  selector: 'app-information-card',
  imports: [TopicBoxBtn],
  templateUrl: './information-card.html',
  styleUrl: './information-card.css',
})
export class InformationCard {
  @Input() id: string = '';
  @Input() tipo: 'usuario' | 'proyecto' = 'usuario';
  @Input() imagen: string = '';
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() topics: Topic[] = [];

  private router = inject(Router)

  navegarAPerfil() {
    if (this.tipo === 'proyecto') {
      this.router.navigate(['/ProjectProfile', this.id]);
    } else {
      this.router.navigate(['/UserProfile', this.id]);
    }
  }
}
