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
import {Footer} from '../../shared/components/footer/footer';
import {Header} from '../../shared/components/header/header';
import {PaginationComponent} from '../../shared/components/pagination-component/pagination-component';

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
    PaginationComponent
  ]
})
export class SearchResult implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private readonly PAGE_SIZE = 4;
  protected currentPageUsers = 1;
  protected currentPageProjects = 1;

  type: 'users' | 'projects' | null = null;
  searchQuery: string = '';

  users: User[] = [];
  projects: Project[] = [];
  private allUsers: User[] = [];
  private allProjects: Project[] = [];

  loadingUsers = false;
  loadingProjects = false;

  selectedLevel: string = '';

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
        this.allUsers = [];
        this.allProjects = [];
        this.selectedLevel = '';
        this.loadData();
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
        this.allUsers = filtered;
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
      next: (filtered) => {
        this.allProjects = filtered;
        this.projects = filtered;
        this.currentPageProjects = 1;
        this.loadingProjects = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos:', err);
        this.loadingProjects = false;
      }
    });
  }

  get pagedProjects(): Project[] {
    const start = (this.currentPageProjects - 1) * this.PAGE_SIZE;
    return this.projects.slice(start, start + this.PAGE_SIZE);
  }

  get pagedUsers(): User[] {
    const start = (this.currentPageUsers - 1) * this.PAGE_SIZE;
    return this.users.slice(start, start + this.PAGE_SIZE);
  }

  get totalPagesProjects(): number {
    return Math.ceil(this.projects.length / this.PAGE_SIZE);
  }

  get totalPagesUsers(): number {
    return Math.ceil(this.users.length / this.PAGE_SIZE);
  }

  goToPageProjects(page: number): void {
    if (page >= 1 && page <= this.totalPagesProjects) {
      this.currentPageProjects = page;
    }
  }

  goToPageUsers(page: number): void {
    if (page >= 1 && page <= this.totalPagesUsers) {
      this.currentPageUsers = page;
    }
  }

  // applyFilters(): void {
  //   if (!this.selectedLevel) {
  //     this.projects = [...this.allProjects];
  //     this.users = [...this.allUsers];
  //     return;
  //   }
  //
  //   const level = this.selectedLevel.toLowerCase();
  //
  //   this.projects = this.allProjects.filter(p =>
  //     p.level?.toLowerCase() === level
  //   );
  //   this.users = this.allUsers.filter(u =>
  //     u.level?.toLowerCase() === level
  //   );
  // }
  //
  // resetFilters(): void {
  //   this.selectedLevel = '';
  //   this.projects = [...this.allProjects];
  //   this.users = [...this.allUsers];
  // }
}
