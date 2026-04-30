
import { Injectable } from '@angular/core';
import {finalize, forkJoin, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Project} from './Project';
import {User} from './User';
import {Topic} from './Topic';
import {AppData} from './AppData';


export interface FetchOptions {
  loadUsers?: boolean;
  loadProjects?: boolean;
  loadTopics?: boolean;
}



@Injectable({ providedIn: 'root' })
export class DataLoader {

  constructor(private http: HttpClient) {}

  private fetchData(options: FetchOptions): Observable<AppData> {
    const requests: { [K in keyof AppData]?: Observable<any> } = {};

    if (options.loadUsers) {
      requests.userData = this.http
        .get<{ Users: User[] }>('users.json')
        .pipe(map(res => res.Users));
    }

    if (options.loadProjects) {
      requests.projectData = this.http
        .get<{ projects: Project[] }>('projects.json')
        .pipe(map(res => res.projects));
    }

    if (options.loadTopics) {
      requests.topicsData = this.http
        .get<{ Topics: Topic[] }>('topics.json')
        .pipe(map(res => res.Topics));
    }

    if (Object.keys(requests).length === 0) {
      return of({});
    }

    return forkJoin(requests) as Observable<AppData>;
  }

  loadData(
    options: FetchOptions,
    onSuccess: (data: AppData) => void,
    onFinally?: () => void,
    onError?: (err: any) => void,
  ): void {

    this.fetchData(options)
      .pipe(
        finalize(() => onFinally?.())
      )
      .subscribe({
        next: (data) => onSuccess(data),
        error: (err) => {
          console.error('Error cargando datos:', err);
          onError?.(err);
        }
      });
  }
}
