import {inject, Injectable} from '@angular/core';
import {collection, collectionData, Firestore} from '@angular/fire/firestore'
import {Observable} from 'rxjs';
import {HeaderElementsModel} from '../models/headerElements.model';
@Injectable({providedIn: 'root'})
export class HeaderElementsService {

  private firestore = inject(Firestore)
  private headerElementCollection = collection(this.firestore, 'header');

  getTopics(): Observable<HeaderElementsModel[]>{
    return collectionData(this.headerElementCollection, { idField: 'id' }) as Observable<HeaderElementsModel[]>;
  }
}

