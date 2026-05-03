
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  docData,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import {catchError, Observable, of} from 'rxjs';
import { Topic } from '../models/topic.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private firestore = inject(Firestore);
  private topicRef = collection(this.firestore, 'topics');

  getTopics(): Observable<Topic[]> {
    return collectionData(this.topicRef, { idField: 'id' }) as Observable<Topic[]>;
  }

  getTopicById(id: string): Observable<Topic | null> {
    const ref = doc(this.firestore, `topics/${id}`);
    return (docData(ref, { idField: 'id' }) as Observable<Topic | undefined>).pipe(
      map((data: Topic | undefined) => (data && data.name ? data : null)),
      catchError(() => of(null))
    );
  }

  addTopic(topic: Topic) {
    return addDoc(this.topicRef, topic);
  }

  updateTopic(id: string, data: Partial<Topic>) {
    const topicDocRef = doc(this.firestore, `topics/${id}`);

    const firestoreData = Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => value !== undefined)
    );

    return updateDoc(topicDocRef, firestoreData);
  }

  deleteTopic(id: string) {
    const topicDocRef = doc(this.firestore, `topics/${id}`);
    return deleteDoc(topicDocRef);
  }
}
