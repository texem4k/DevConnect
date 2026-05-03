import {Component, inject, Input} from '@angular/core';
import {TopicBoxBtn} from '../topic-box-btn/topic-box-btn';
import {collection, collectionData, Firestore, query, where} from '@angular/fire/firestore';
import {Observable, of} from 'rxjs';
import {Topic} from '../../../core/models/topic.model';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-topics-grid',
  imports: [TopicBoxBtn, AsyncPipe],
  templateUrl: './topics-grid.html',
  styleUrl: './topics-grid.css',
})
export class TopicsGrid {
  @Input() title: string = ''
  @Input() items: string[] = []
  firestore = inject(Firestore)
  topics$: Observable<Topic[]> = of([]);

  get topics() {
    if (!this.items?.length) return;
    const ref = collection(this.firestore, 'topics');
    this.topics$ = collectionData(
      query(ref, where('__name__', 'in', this.items)),
      { idField: 'id' }
    ) as Observable<Topic[]>;
  }


  protected readonly top = top;
}
