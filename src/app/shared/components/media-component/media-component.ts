import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Project} from '../../services/Project';
import {User} from '../../services/User';

@Component({
  selector: 'app-media-component',
  imports: [],
  templateUrl: './media-component.html',
  styleUrl: './media-component.css',
})
export class MediaComponent implements OnInit {
  @Input() imagen: string | undefined;
  @Input() titulo: string | undefined;
  @Input() descripcion: string | undefined;

  @Input() project: Project | undefined;
  @Input() user: User | undefined;

  idUser!: number;

  ngOnInit() {
    if (this.user) {
      this.idUser=this.user.Id
    }
  }
  constructor(private router: Router) {}

  navegarAProyecto() {
    this.router.navigate(['/ProjectProfile', this.project?.title]);
  }

  navegarAUsuario() {
    this.router.navigate(['/UserProfile', this.idUser]);
  }
}
