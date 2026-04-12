import { Component } from '@angular/core';
import {MediaComponent} from '../media-component/media-component';

@Component({
  selector: 'app-media-list',
  imports: [MediaComponent],
  templateUrl: './media-list.html',
  styleUrl: './media-list.css',
})
export class MediaList {}
