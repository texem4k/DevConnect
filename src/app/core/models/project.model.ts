import {Topic} from './topic.model';


export interface Project {
  id: string;
  title: string;
  creator: string;
  isCompanyProject: boolean;
  image: string;
  ownerEmail: string;
  ownerPhone: string;
  description: string;
  requireTopic: string[];
  maintainers: string[];
  numberParticipants: number;
  limitDate: string
}
