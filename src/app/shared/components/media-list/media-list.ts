import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaComponent } from '../media-component/media-component';
import { Project } from '../../../core/models/project.model';
import { User } from '../../../core/models/user.model';
import { IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-media-list',
  imports: [MediaComponent, IonList],
  templateUrl: './media-list.html',
  styleUrl: './media-list.css',
})
export class MediaList {
  @Input() projects: Project[] = [];
  @Input() users: User[] = [];
  @Input() showActions: boolean = false;
  @Input() flat: boolean = false;
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  get getUsers(): User[] {
    return this.users ?? [];
  }

  get getProjects(): Project[] {
    return this.projects ?? [];
  }

  handleEdit(project: Project) {
    this.edit.emit(project);
  }

  handleDelete(project: Project) {
    this.delete.emit(project);
  }
}
