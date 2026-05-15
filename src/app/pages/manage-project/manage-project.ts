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
import {AuthService} from '../../core/services/auth-service';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-manage-project',
  imports: [
    Footer,
    PaginationComponent,
    MediaList,
    Header,
    IonContent,
  ],
  templateUrl: './manage-project.html',
  styleUrl: './manage-project.css',
})
export class ManageProject implements OnInit {
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  projects!: Project[] | undefined;
  userInformation!: User | undefined;
  loading = true;

  ngOnInit() {
    this.userService.getUserById(this.route.snapshot.params['id']).subscribe(user => {
      this.userInformation = user ?? undefined;
      if (this.userInformation) {
        this.projectService.getProjectsByCreator(this.userInformation.Nickname).subscribe(projects => {
          this.projects = projects;
          this.loading = false;
          this.cd.detectChanges();
        });
      }
    });
  }

  onEdit(project: Project) {
    this.router.navigate(['/CreateProject', project.id]);
  }

  onDelete(project: Project) {
    this.projectService.deleteProject(project.id, this.auth.currentUser?.uid ?? '');
  }
}
