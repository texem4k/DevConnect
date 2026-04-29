export interface User {
  Id: number;
  Nickname: string;
  Avatar: string;
  Description: string;
  Topic: { Specialty: string[] };
}
