// home.component.ts
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, User, Project } from '../../shared/services/home-service';
//import {Header} from '../../shared/components/header/header';
import {Banner} from '../../shared/components/banner/banner';
import {InformationCard} from '../../shared/components/information-card/information-card';
import {MediaList} from '../../shared/components/media-list/media-list';
import {Footer} from '../../shared/components/footer/footer';


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
  trendingUsers: User[] = [];
  trendingProjects: Project[] = [];
  isLoading = true;

  constructor(
    private homeService: HomeService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.homeService.fetchHomeData().subscribe({
      next: ({ userData, projectData }) => {
        this.trendingUsers = userData.Users.slice(0, 3);
        this.trendingProjects = projectData.projects.slice(0, 4);
        this.isLoading = false;
        this.cd.detectChanges();
        },
      error: (err) => {
        console.error('Error cargando datos:', err)
        this.isLoading = false;
      }

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
    this.router.navigate(['/SearchResult']);
  }

  discoverUsers(): void {
    this.router.navigate(['/SearchResult']);
  }
}
