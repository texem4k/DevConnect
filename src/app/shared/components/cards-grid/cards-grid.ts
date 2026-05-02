import {Component, Input} from '@angular/core';
import {InformationCard} from '../information-card/information-card';

@Component({
  selector: 'app-cards-grid',
  imports: [InformationCard],
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
