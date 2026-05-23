import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BannerProfile } from '../../shared/components/banner-profile/banner-profile';
import { UserSkills } from '../../shared/components/user-skills/user-skills';
import { CardsGrid } from '../../shared/components/cards-grid/cards-grid';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { UserService } from '../../core/services/user-crud';
import { Project } from '../../core/models/project.model';
import { User } from '../../core/models/user.model';
import { Topic } from '../../core/models/topic.model';
import { ProjectService } from '../../core/services/project-crud';
import { Header } from '../../shared/components/header/header';
import {first, map, switchMap} from 'rxjs/operators';
import { combineLatest, forkJoin, of } from 'rxjs';
import { TopicService } from '../../core/services/topic-crud';
import { AuthService } from '../../core/services/auth-service';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-profile',
  imports: [BannerProfile, UserSkills, CardsGrid, Footer, Header, RouterLink, IonContent, IonButton],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private userService = inject(UserService);
  private projectService = inject(ProjectService);
  private topicsService = inject(TopicService);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  protected isOwnedProfile = false;
  userInformation: User | undefined;
  userProjects: Project[] = [];
  userTopics: Topic[] = [];
  userLanguages: Topic[] = [];

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const userId = params['id'];
        return combineLatest([
          this.userService.getUserById(userId),
          this.auth.currentUser$
        ]).pipe(
          first(),
          switchMap(([user, authUser]) => {
            this.userInformation = user;
            this.isOwnedProfile = authUser?.uid === user?.uid;

            return forkJoin([
              this.projectService.getProjectsByCreator(user.Nickname).pipe(first()),
              this.resolvedTopics()
            ]);
          })
        );
      })
    ).subscribe(([projects, topics]) => {
      this.userProjects = projects;
      this.userTopics = topics.filter(t => t?.cat !== 'Lenguaje');
      this.userLanguages = topics.filter(t => t?.cat === 'Lenguaje');
      this.cd.detectChanges();
    });
  }

  private resolvedTopics() {
    const ids = this.userInformation?.Topic;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return of([] as Topic[]);

    return forkJoin(
      ids.map(id => this.topicsService.getTopicById(id).pipe(first()))
    ).pipe(
      map(topics => topics.filter((t): t is Topic => t !== null))
    );
  }
}
