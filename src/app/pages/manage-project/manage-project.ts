import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {Footer} from '../../shared/components/footer/footer';
import {PaginationComponent} from '../../shared/components/pagination-component/pagination-component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaList} from '../../shared/components/media-list/media-list';
import {User} from '../../core/models/user.model';
import {Project} from '../../core/models/project.model';
import {ProjectService} from '../../core/services/project-crud';
import {UserService} from '../../core/services/user-crud';
import {Header} from '../../shared/components/header/header';

@Component({
  selector: 'app-manage-project',
  imports: [
    Footer,
    PaginationComponent,
    MediaList,
    Header,
  ],
  templateUrl: './manage-project.html',
  styleUrl: './manage-project.css',
})
export class ManageProject implements OnInit {
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private projectService= inject(ProjectService);
  private userService= inject(UserService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);


  projects!: Project[] | undefined;
  userInformation!: User | undefined;
  loading = true;

  ngOnInit() {
    this.userService.getUser().subscribe(users => {
      this.userInformation = users.find(u => u.uid === this.route.snapshot.params['id']) ?? undefined;
    })
    this.projectService.getProject().subscribe(projects => {
      this.projects = projects.filter(p => p.creator===this.userInformation?.Nickname) ?? undefined;
    })
    this.loading = false;
    console.log(this.projects);
    this.cd.detectChanges();
  }

  onEdit(project: Project) {
    this.router.navigate(['/CreateProject', project.id]);
  }

  onDelete(project: Project) {
    this.projectService.deleteProject(project.id);
  }
}
