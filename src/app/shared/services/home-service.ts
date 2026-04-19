// home.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

export interface User {
  Id: number;
  Nickname: string;
  Avatar: string;
  Description: string;
  Topic: { Specialty: string[] };
}

export interface Project {
  image: string;
  title: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) {}

  // forkJoin = Promise.all pero con Observables
  fetchHomeData() {
    return forkJoin({
      userData: this.http.get<{ Users: User[] }>('users.json'),
      projectData: this.http.get<{ projects: Project[] }>('projects.json')
    });
  }
}
