import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-media-component',
  imports: [],
  templateUrl: './media-component.html',
  styleUrl: './media-component.css',
})
export class MediaComponent {
  @Input() imagen: string | undefined;
  @Input() titulo: string | undefined;
  @Input() descripcion: string | undefined;

  constructor(private router: Router) {}

  navegarAProyecto() {
    this.router.navigate(['/ProjectProfile'], {
      queryParams: { title: this.titulo }
    })
  }
}
