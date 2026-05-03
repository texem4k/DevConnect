import {Social} from './social.model';

export interface User {
  uid: string;
  Fullname: string;
  Nickname: string;
  Telephone: string;
  Gmail: string;
  Password: string;
  Description: string;
  isCompany: Boolean;
  Topic: string[];
  Projects: string[];
  Avatar: string;
  Banner: string;

  Social: Social;
  CV: string;
}
