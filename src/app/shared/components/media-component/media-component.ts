import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Project} from '../../../core/models/project.model';
import {User} from '../../../core/models/user.model';
import { IonItem, IonThumbnail, IonImg, IonLabel, IonButtons, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-media-component',
  imports: [IonItem, IonThumbnail, IonImg, IonLabel, IonButtons, IonButton],
  templateUrl: './media-component.html',
  styleUrl: './media-component.css',
})
export class MediaComponent implements OnInit {
  @Input() imagen: string | undefined;
  @Input() titulo: string | undefined;
  @Input() descripcion: string | undefined;

  @Input() project: Project | undefined;
  @Input() user: User | undefined;
  @Input() showActions: boolean = false;

  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  idUser!: string | undefined;

  ngOnInit() {
    if (this.user) {
      this.idUser = this.user.uid;
    }
  }

  constructor(private router: Router) {}

  navegarAProyecto() {
    this.router.navigate(['/ProjectProfile', this.project!.id]);
  }

  navegarAUsuario() {
    this.router.navigate(['/UserProfile', this.idUser]);
  }

  onEdit() {
    if (this.project) {
      this.router.navigate(['/CreateProject', this.project.id]);
    }
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    if (this.project) {
      this.delete.emit(this.project);
    }
  }
}
