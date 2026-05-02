import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MediaComponent} from '../media-component/media-component';
import {Project} from '../../../core/models/project.model';
import {User} from '../../../core/models/user.model';


@Component({
  selector: 'app-media-list',
  imports: [MediaComponent],
  templateUrl: './media-list.html',
  styleUrl: './media-list.css',
})
export class MediaList implements OnInit {
  @Input() projects: Project[] = [];
  @Input() users: User[] = [];
  @Input() type: String=""

  constructor(private cd: ChangeDetectorRef) {}

  @Input() showActions: boolean = false;
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  ngOnInit() {
    if(this.projects?.length > 0){
      this.type="projects"
    }

    else if(this.users?.length > 0){
      this.type = "users"
    }
    this.cd.detectChanges();

  }

  get getUsers() {
      return this.users ?? []
  }

  get getProjects(){
    return this.projects ?? []
  }

  // Re‑emitir los eventos desde el hijo
  handleEdit(project: Project) {
    this.edit.emit(project);
  }

  handleDelete(project: Project) {
    this.delete.emit(project);
  }
}
