import {Topic} from './topic.model';
import {ProjectRef} from './project-ref.model';
import {Social} from './social.model';

export interface User {
  id?: number;
  fullname: string;
  nickname: string;
  gmail: string;
  password: string;
  description: string;

  topic: Topic;
  projects: ProjectRef[];

  avatar: string;
  banner: string;

  social: Social;
  cv: string;
}
