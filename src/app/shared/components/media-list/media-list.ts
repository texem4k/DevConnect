import {Component, Input} from '@angular/core';
import {MediaComponent} from '../media-component/media-component';
import {Project} from '../../services/home-service';


@Component({
  selector: 'app-media-list',
  imports: [MediaComponent],
  templateUrl: './media-list.html',
  styleUrl: './media-list.css',
})
export class MediaList {
  @Input() items: Project[] = [];

  get limitedItems() {
    return this.items.slice(0,4)
  }
}
