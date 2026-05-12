import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CardsGrid} from '../../shared/components/cards-grid/cards-grid';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TopicsGrid} from '../../shared/components/topics-grid/topics-grid';
import {Footer} from '../../shared/components/footer/footer';
import {UserService} from '../../core/services/user-crud';
import {ProjectService} from '../../core/services/project-crud';
import {Project} from '../../core/models/project.model';
import {User} from '../../core/models/user.model';
import { tap } from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Header} from '../../shared/components/header/header';
import { IonContent, IonImg, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-project-profile',
  imports: [
    CardsGrid,
    RouterLink,
    TopicsGrid,
    Footer,
    Header,
    IonContent,
    IonImg,
    IonButton,
  ],
  templateUrl: './project-profile.html',
  styleUrl: './project-profile.css',
})
export class ProjectProfile implements OnInit {


  private userService = inject(UserService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute)
  private cd = inject(ChangeDetectorRef)

  id?: string;
  project!: Project;
  maintainers: User[] = []

  ngOnInit() {
    const projectId = this.route.snapshot.params['id'];
    this.projectService.getProjectById(projectId).pipe(
      tap(project => this.project = project),
      switchMap(project =>
        this.userService.getUser().pipe(
          tap(users => {
            const owner = users.find(u => u.Nickname === project.creator);
            this.id = owner?.uid;
          }),
          switchMap(() => this.projectService.getMaintainers(project.id))
        )
      )
    ).subscribe(maintainers => {
      this.maintainers = maintainers;
      this.cd.detectChanges();
    });
  }
}
