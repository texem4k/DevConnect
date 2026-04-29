export interface Project {
  id: string;
  title: string;
  creator: string;
  isCompanyProject: boolean;
  image: string;
  description: string;
  requirements: ProjectRequirements;
  maintainers: string[];
}
