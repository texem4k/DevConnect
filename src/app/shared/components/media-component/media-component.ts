import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-media-component',
  imports: [],
  templateUrl: './media-component.html',
  styleUrl: './media-component.css',
})
export class MediaComponent {
  @Input() imagen: string = ''
  @Input() titulo: string = ''
  @Input() descripcion: string = ''
}
