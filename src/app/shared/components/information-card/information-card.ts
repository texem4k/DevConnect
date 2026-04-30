import {Component, Input} from '@angular/core';
import {TopicBoxBtn} from '../topic-box-btn/topic-box-btn';
import { Router } from '@angular/router'

@Component({
  selector: 'app-information-card',
  imports: [TopicBoxBtn],
  templateUrl: './information-card.html',
  styleUrl: './information-card.css',
})
export class InformationCard {
  @Input() id: number = 0

  @Input() imagen: string | undefined;
  @Input() titulo: string | undefined;
  @Input() descripcion: string | undefined;

  @Input() topics: string[] = []

  constructor(private router: Router) {}

  navegarAPerfil() {
    this.router.navigate(['/UserProfile'],{
      state: {id: this.id}
    });
  }
}
