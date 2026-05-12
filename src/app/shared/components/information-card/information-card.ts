import {Component, inject, Input} from '@angular/core';
import { TopicBoxBtn } from '../topic-box-btn/topic-box-btn';
import { Router } from '@angular/router';
import {Topic} from '../../../core/models/topic.model';
import {map} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {TopicService} from '../../../core/services/topic-crud';
import {AsyncPipe} from '@angular/common';
import { IonCard, IonCardContent, IonCardTitle, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-information-card',
  imports: [TopicBoxBtn, AsyncPipe, IonCard, IonCardContent, IonCardTitle, IonImg],
  templateUrl: './information-card.html',
  styleUrl: './information-card.css',
})
export class InformationCard {
  @Input() id: string = '';
  @Input() tipo: 'usuario' | 'proyecto' = 'usuario';
  @Input() imagen: string = '';
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() topics: string[] = [];

  topics$ = this.getTopics()

  private router = inject(Router)
  private topicsService = inject(TopicService)

  navegarAPerfil() {
    if (this.tipo === 'proyecto') {
      this.router.navigate(['/ProjectProfile', this.id]);
    } else {
      this.router.navigate(['/UserProfile', this.id]);
    }
  }

  private resolvedTopics() {
    const ids = this.topics;
    if (!ids || !Array.isArray(ids)  || ids.length === 0) return of([]);
    return forkJoin(ids.map(id => this.topicsService.getTopicById(id))).pipe(
      map(topics => topics.filter((t): t is Topic => t !== null))
    );
  }

  getTopics(){
    return this.resolvedTopics().pipe(
      map(topics => topics)
    );
  }
}
