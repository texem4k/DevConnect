import { ChangeDetectorRef, Component, inject, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { BannerProfile } from '../../shared/components/banner-profile/banner-profile';
import { UserSkills } from '../../shared/components/user-skills/user-skills';
import { UserDataField } from '../../shared/components/user-data-field/user-data-field';
import { CardsGrid } from '../../shared/components/cards-grid/cards-grid';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { UserService } from '../../core/services/user-crud';
import { Project } from '../../core/models/project.model';
import { User } from '../../core/models/user.model';
import { ProjectService } from '../../core/services/project-crud';
import { Header } from '../../shared/components/header/header';
import {map, switchMap} from 'rxjs/operators';
import {firstValueFrom, forkJoin, of} from 'rxjs';
import {TopicService} from '../../core/services/topic-crud';
import {AuthService} from '../../core/services/auth-service';

@Component({
  selector: 'app-user-profile',
  imports: [BannerProfile, UserSkills, UserDataField, CardsGrid, Footer, Header, RouterLink],
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
  protected isOwnedProfile: boolean = false;

  userInformation: User | undefined;
  userProjects: Project[] = [];

  ngOnInit() {
    const userId = this.route.snapshot.params['id'];

    this.userService.getUserById(userId).pipe(
      switchMap(user => {
        this.userInformation = user;
        return this.projectService.getProject();
      })
    ).subscribe(projects => {
      this.userProjects = projects.filter(
        p => p.creator === this.userInformation?.Nickname
      );
      this.auth.currentUser$.subscribe(user => {
        user?.uid === this.userInformation?.uid ? this.isOwnedProfile = true : this.isOwnedProfile = false;
      })
      this.cd.detectChanges();
    });
  }


  private resolvedTopics() {
    const ids = this.userInformation?.Topic;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return of([]);

    return forkJoin(ids.map(id => this.topicsService.getTopicById(id)));
  }

  getTopics(){
    return this.resolvedTopics().pipe(
      map(topics => topics.filter(t => t?.cat !== 'Lenguaje'))
    );
  }

  getTopicsLanguage(){
    return this.resolvedTopics().pipe(
      map(topics => topics.filter(t => t?.cat === 'Lenguaje'))
    );
  }
}
