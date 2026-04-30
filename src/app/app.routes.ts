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

export const routes: Routes = [
  {path: "", component: Index},
  {path: "AboutUs", component: AboutUs},
  {path: "CreateProject", component: CreateProject},
  {path: "Incidents", component: Incidents},
  {path: "Login", component: Login},
  {path: "ManageProfile", component: ManageProfile},
  {path: "ManageProject", component: ManageProject},
  {path: "ProjectProfile/:title", component: ProjectProfile},
  {path: "SearchResult", component: SearchResult},
  {path: "UserProfile/:id", component: UserProfile},
  {path: "UserRegistration", component: UserRegistration},
];
