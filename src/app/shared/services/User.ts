export interface User {
  Id: number;
  Fullname: string;  // Coincide con JSON
  Nickname: string;
  Gmail: string;
  Password: string;   // Nota: No almacenes passwords en claro en prod
  Description: string;
  Topic: {Speciality: string[], Language: string[]};
  Projects: Project[];
  Avatar: string;
  Banner: string;
  Social: {
    Github: SocialNetwork;
    Twitter: SocialNetwork;
    Instagram: SocialNetwork;
    Linkedin: SocialNetwork;
  };
  CV: string;
}

interface SocialNetwork {
  Name: string;
  Link: string;
}

interface Project {
  Name: string;
}
