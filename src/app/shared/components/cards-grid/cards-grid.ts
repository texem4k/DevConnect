import {Component, Input} from '@angular/core';
import {InformationCard} from '../information-card/information-card';
import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

@Component({
  selector: 'app-cards-grid',
  imports: [InformationCard, IonGrid, IonRow, IonCol],
  templateUrl: './cards-grid.html',
  styleUrl: './cards-grid.css',
})
export class CardsGrid {
  @Input() title: string = ''
  @Input() items: any[] = []
  @Input() isProject: boolean = false;

  get itemsLimitados() {
    return this.items.slice(0, 4)
  }
}
