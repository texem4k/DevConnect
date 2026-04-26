import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MediaComponent} from '../media-component/media-component';
import {getProject} from '@angular/cli/src/commands/mcp/workspace-utils';
import {Project} from '../../services/Project';
import {User} from '../../services/User';


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

  ngOnInit() {
      if(this.type == ''){
        if(this.projects.length > 0){
          this.type="projects"
        }

        else if(this.users.length > 0){
          this.type = "users"
        }
        this.cd.detectChanges();
      }

  }

  get getUsers() {
      return this.users.slice(0,4)
  }

  get getProjects(){
    return this.projects.slice(0,4)
  }
}
