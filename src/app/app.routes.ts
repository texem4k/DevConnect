import { Routes } from '@angular/router';
import {Index} from './pages/index';
import {AboutUs} from './pages/about-us/about-us';
import {CreateProject} from './pages/create-project/create-project';
import {Incidents} from './pages/incidents/incidents';
import {Login} from './pages/login/login';
import {ManageProfile} from './pages/manage-profile/manage-profile';
import {ManageProject} from './pages/manage-project/manage-project';
import {ProjectProfile} from './pages/project-profile/project-profile';
import {SearchResult} from './pages/search-result/search-result';
import {UserProfile} from './pages/user-profile/user-profile';
import {UserRegistration} from './pages/user-registration/user-registration';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {path: "", pathMatch: "full" , component: Index},
  {path: "AboutUs", pathMatch: "full", component: AboutUs},
  {path: "CreateProject", component: CreateProject, canActivate: [authGuard]},
  {path: "CreateProject/:id", component: CreateProject, canActivate: [authGuard]},
  {path: "Incidents", pathMatch: "full", component: Incidents},
  {path: "Login", pathMatch: "full", component: Login},
  {path: "ManageProfile/:id", pathMatch: "full", component: ManageProfile, canActivate: [authGuard]},
  {path: "ManageProject/:id", pathMatch: "full", component: ManageProject, canActivate: [authGuard]},
  {path: "ProjectProfile/:id", pathMatch: "full", component: ProjectProfile},
  { path: 'SearchResult', component: SearchResult },
  { path: 'SearchResult/:type', component: SearchResult },
  {path: "UserProfile/:id", pathMatch: "full", component: UserProfile},
  {path: "UserRegistration", pathMatch: "full", component: UserRegistration},
];
