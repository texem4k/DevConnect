import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {Banner} from '../../shared/components/banner/banner';
import {InformationCard} from '../../shared/components/information-card/information-card';
import {MediaList} from '../../shared/components/media-list/media-list';
import {Footer} from '../../shared/components/footer/footer';
import {Header} from '../../shared/components/header/header';
import {UserService} from '../../core/services/user-crud';
import {ProjectService} from '../../core/services/project-crud';
import {User} from '../../core/models/user.model';
import {Project} from '../../core/models/project.model';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  imports: [
    Banner,
    InformationCard,
    MediaList,
    Footer,
    Header,
    IonContent,
    IonButton,
  ],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router)
  private projectService = inject(ProjectService);

  users: User[] | undefined;
  projects: Project[] | undefined;
  usersData$ = this.userService.getUser()
  projectsData$ = this.projectService.getProject()


  ngOnInit(): void {
    this.usersData$.subscribe(users => {
      this.users = users
    })

    this.projectsData$.subscribe(projects => {
      this.projects = projects
    })
  }

  discoverUsers() {
    this.router.navigate(['/SearchResult', 'users']);
  }

  discoverProjects() {
    this.router.navigate(['/SearchResult', 'projects']);
  }
}
