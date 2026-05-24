import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CardsGrid } from '../../shared/components/cards-grid/cards-grid';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TopicsGrid } from '../../shared/components/topics-grid/topics-grid';
import { Footer } from '../../shared/components/footer/footer';
import { UserService } from '../../core/services/user-crud';
import { ProjectService } from '../../core/services/project-crud';
import { Project } from '../../core/models/project.model';
import { User } from '../../core/models/user.model';
import { tap, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { Header } from '../../shared/components/header/header';
import { IonContent, IonImg, IonButton } from '@ionic/angular/standalone';
import { SubscriptionsService } from '../../core/services/suscripción';
import { AuthService } from '../../core/services/auth-service';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe,
  ],
  templateUrl: './project-profile.html',
  styleUrl: './project-profile.css',
})
export class ProjectProfile implements OnInit, OnDestroy {

  private userService = inject(UserService);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);
  private subscriptions = inject(SubscriptionsService);
  private authService = inject(AuthService);

  private destroy$ = new Subject<void>();

  id?: string;
  project!: Project;
  maintainers: User[] = [];
  isLoggedIn = false;

  // Propiedad en vez de función para evitar evaluación continua
  isSubscribed$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    const projectId = this.route.snapshot.params['id'];

    this.projectService.getProjectById(projectId).pipe(
      tap(project => this.project = project),
      switchMap(project =>
        this.userService.getUserByNickname(project.creator).pipe(
          tap(user => {
            this.id = user?.uid;
            // Actualizar estado de suscripción una sola vez al cargar
            this.updateSubscriptionState();
          }),
          switchMap(() => this.projectService.getMaintainers(project.id))
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe(maintainers => {
      this.maintainers = maintainers;
      this.cd.detectChanges();
    });

    this.authService.isLoggedIn$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(logged => {
      this.isLoggedIn = logged;
    });

    this.subscriptions.init().then(() => {
      // Actualizar tras init para reflejar estado real
      this.updateSubscriptionState();
    });
  }

  private async updateSubscriptionState() {
    if (this.id != null) {
      this.isSubscribed$.next(await this.subscriptions.isSubscribed(this.project.id));
    }
  }

  subscribe() {
    if (this.id != null) {
      this.subscriptions.subscribe(this.project.id);
      this.isSubscribed$.next(true);
    }
  }

  unSubscribe() {
    if (this.id != null) {
      this.subscriptions.unSubscribe(this.project.id);
      this.isSubscribed$.next(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
