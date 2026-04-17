import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

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

  constructor(private router: Router) {}

  navegarAProyecto() {
    this.router.navigate(['/ProjectProfile'], {
      queryParams: { title: this.titulo }
    })
  }
}
