import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Topic } from '../../../core/models/topic.model';
import { AsyncPipe } from '@angular/common';
import { IonChip, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-topics-grid',
  imports: [AsyncPipe, IonChip, IonLabel],
  templateUrl: './topics-grid.html',
  styleUrl: './topics-grid.css',
})
export class TopicsGrid implements OnChanges {
  @Input() title: string = '';
  @Input() items: string[] = [];

  firestore = inject(Firestore);
  topics$: Observable<Topic[]> = of([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.loadTopics();
    }
  }

  private loadTopics(): void {
    if (!this.items?.length) {
      this.topics$ = of([]);
      return;
    }

    const ref = collection(this.firestore, 'topics');
    this.topics$ = collectionData(
      query(ref, where('__name__', 'in', this.items)),
      { idField: 'id' }
    ) as Observable<Topic[]>;
  }
}
