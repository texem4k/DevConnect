// home.component.ts
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
//import {Header} from '../../shared/components/header/header';
import {Banner} from '../../shared/components/banner/banner';
import {InformationCard} from '../../shared/components/information-card/information-card';
import {MediaList} from '../../shared/components/media-list/media-list';
import {Footer} from '../../shared/components/footer/footer';
import firebase from 'firebase/compat/app';
import {Project} from '../../shared/services/Project';
import {DataLoader} from '../../shared/services/get-data-service';
import {User} from '../../shared/services/User';


@Component({
  selector: 'app-home',
  imports: [
    Banner,
    InformationCard,
    MediaList,
    Footer,
  ],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  userData: User[] = [];
  projectData: Project[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private loader: DataLoader
  ) {}

  ngOnInit(): void {

    this.loader.loadData(
    {loadUsers: true, loadProjects: true},
    (data)=>{
      this.userData = data.userData ?? [];
      this.projectData = data.projectData ?? [];
      this.isLoading = false;
      this.cd.detectChanges();
    });
  }

  // Equivalente a initDiscoverButtons → navegación con Router
  goToSearch(): void {
    this.router.navigate(['/search']);
  }
  // Equivalente a onClick del user card
  goToUserProfile(userId: number): void {
    this.router.navigate(['/user-profile', userId]);
  }

  // Equivalente a onClick del project card
  goToProject(title: string): void {
    this.router.navigate(['/project-profile'], { queryParams: { title } });
  }

  discoverProjects(): void {
    //Se puede añadir lógica aqui
    this.router.navigate(['/SearchResult'],{
      state: {type: 'projects',data: this.projectData}
    });
  }

  discoverUsers(): void {
    this.router.navigate(['/SearchResult'],{
      state: {type: 'users', data: this.userData}
    });
  }
}
