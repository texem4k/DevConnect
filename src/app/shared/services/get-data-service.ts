
import { Injectable } from '@angular/core';
import {forkJoin} from 'rxjs';
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



  fetchData() {
    return forkJoin({
      userData: this.http.get<{ Users: User[] }>('users.json'),
      projectData: this.http.get<{ projects: Project[] }>('projects.json'),
      topicsData: this.http.get<{ Topics: Topic[] }>('topics.json'),
    });
  }


  loadData(
    options: FetchOptions,
    onSuccess: (data: AppData) => void,
    onFinally?: () => void,
    onError?: (err: any) => void,
  ): void {

    this.fetchData().subscribe({
      next: ({ userData, projectData, topicsData }) => {

        const result: AppData = {};

        if (options.loadUsers)    result.userData    = userData.Users;
        if (options.loadProjects) result.projectData = projectData.projects;
        if (options.loadTopics) result.topicsData = topicsData.Topics;

        onSuccess(result);
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        onError?.(err);
      },
      complete: () => onFinally?.()
    });
  }
}
