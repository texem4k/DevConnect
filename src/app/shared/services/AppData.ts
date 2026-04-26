import {User} from './User';
import {Project} from './Project';
import {Topic} from './Topic';

export interface AppData {
  userData?: User[];
  projectData?: Project[];
  topicsData?: Topic[];
}
