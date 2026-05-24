import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project-crud';
import { UserService } from '../../core/services/user-crud';
import { Project } from '../../core/models/project.model';
import { User } from '../../core/models/user.model';
import { MediaList } from '../../shared/components/media-list/media-list';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import { PaginationComponent } from '../../shared/components/pagination-component/pagination-component';
import { IonContent, IonItem, IonCheckbox, IonRadioGroup, IonRadio, IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth-service';
import { SubscriptionsService } from '../../core/services/suscripción';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.html',
  styleUrl: './search-result.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MediaList,
    Header,
    Footer,
    PaginationComponent,
    IonContent,
    IonItem,
    IonCheckbox,
    IonRadioGroup,
    IonRadio,
    IonSelect,
    IonSelectOption,
    IonButton,
  ]
})
export class SearchResult implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private subscriptionsService = inject(SubscriptionsService);
  private destroy$ = new Subject<void>();
  private readonly PAGE_SIZE = 4;

  protected currentPageUsers = 1;
  protected currentPageProjects = 1;
  protected currentPageMixed = 1;

  type: 'users' | 'projects' | null = null;
  searchQuery: string = '';

  users: User[] = [];
  projects: Project[] = [];
  displayedProjects: Project[] = [];
  followProjects: Project[] = [];
  showFollows: boolean = false;

  loadingUsers = false;
  loadingProjects = false;
  isLoggedIn = false;


  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([params, queryParams]) => {
        this.type = params.get('type') as 'users' | 'projects' | null;
        this.searchQuery = queryParams.get('q') || '';
        this.users = [];
        this.projects = [];
        this.displayedProjects = [];
        this.currentPageUsers = 1;
        this.currentPageProjects = 1;
        this.currentPageMixed = 1;
        this.loadData();
      });

    this.auth.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
      if (!logged) {
        this.showFollows = false;
        this.displayedProjects = this.projects;
        this.currentPageProjects = 1;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    if (this.searchQuery) {
      this.loadUsers(this.searchQuery);
      this.loadProjects(this.searchQuery);
    } else if (this.type === 'users') {
      this.loadUsers();
    } else if (this.type === 'projects') {
      this.loadProjects();
    } else {
      this.loadUsers();
      this.loadProjects();
    }
  }

  loadUsers(query?: string): void {
    this.loadingUsers = true;
    this.userService.getUser().pipe(
      map(users => {
        if (!query) return users;
        const q = query.toLowerCase();
        return users.filter(u =>
          u.Nickname?.toLowerCase().includes(q) ||
          u.Gmail?.toLowerCase().includes(q)
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (filtered) => {
        this.users = filtered;
        this.currentPageUsers = 1;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loadingUsers = false;
      }
    });
  }

  loadProjects(query?: string): void {
    this.loadingProjects = true;
    this.projectService.getProject().pipe(
      map(projects => {
        if (!query) return projects;
        const q = query.toLowerCase();
        return projects.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: async (filtered) => {
        this.projects = filtered;
        this.currentPageProjects = 1;
        this.loadingProjects = false;

        // Si el filtro de seguidos estaba activo, reaplicarlo con los nuevos datos
        if (this.showFollows) {
          const subscribedIds = await this.subscriptionsService.getSubscribedProjectIds();
          this.displayedProjects = this.projects.filter(p => subscribedIds.includes(p.id));
        } else {
          this.displayedProjects = filtered;
        }
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
        this.loadingProjects = false;
      }
    });
  }

  async follows(event: any): Promise<void> {
    if (this.showFollows) {
      const subscribedIds = await this.subscriptionsService.getSubscribedProjectIds();
      this.displayedProjects = this.projects.filter(p => subscribedIds.includes(p.id));
    } else {
      this.displayedProjects = this.projects;
    }
    this.currentPageProjects = 1;
  }

  // ── Paginación Proyectos (usa displayedProjects) ──────────────────────────

  get pagedProjects(): Project[] {
    const start = (this.currentPageProjects - 1) * this.PAGE_SIZE;
    return this.displayedProjects.slice(start, start + this.PAGE_SIZE);
  }

  get totalPagesProjects(): number {
    return Math.ceil(this.displayedProjects.length / this.PAGE_SIZE);
  }

  goToPageProjects(page: number): void {
    if (page >= 1 && page <= this.totalPagesProjects) {
      this.currentPageProjects = page;
    }
  }

  // ── Paginación Usuarios ───────────────────────────────────────────────────

  get pagedUsers(): User[] {
    const start = (this.currentPageUsers - 1) * this.PAGE_SIZE;
    return this.users.slice(start, start + this.PAGE_SIZE);
  }

  get totalPagesUsers(): number {
    return Math.ceil(this.users.length / this.PAGE_SIZE);
  }

  goToPageUsers(page: number): void {
    if (page >= 1 && page <= this.totalPagesUsers) {
      this.currentPageUsers = page;
    }
  }

  // ── Modo mixto (usa displayedProjects) ────────────────────────────────────

  get mixedItems(): (Project | User)[] {
    const result: (Project | User)[] = [];
    const maxLen = Math.max(this.displayedProjects.length, this.users.length);
    for (let i = 0; i < maxLen; i++) {
      if (this.displayedProjects[i]) result.push(this.displayedProjects[i]);
      if (this.users[i]) result.push(this.users[i]);
    }
    return result;
  }

  get pagedMixedProjects(): Project[] {
    const start = (this.currentPageMixed - 1) * this.PAGE_SIZE;
    return this.mixedItems
      .slice(start, start + this.PAGE_SIZE)
      .filter((item): item is Project => 'title' in item);
  }

  get pagedMixedUsers(): User[] {
    const start = (this.currentPageMixed - 1) * this.PAGE_SIZE;
    return this.mixedItems
      .slice(start, start + this.PAGE_SIZE)
      .filter((item): item is User => 'Nickname' in item);
  }

  get totalPagesMixed(): number {
    return Math.ceil(this.mixedItems.length / this.PAGE_SIZE);
  }

  goToPageMixed(page: number): void {
    if (page >= 1 && page <= this.totalPagesMixed) {
      this.currentPageMixed = page;
    }
  }
}
