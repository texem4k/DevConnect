export interface Project {
  image: string;
  title: string;
  description: string;
  requirements:{ technologies: string[], knowledgeAreas: string[], level: string};
  maintainers: string[];
  creator: string;
  isCompanyProject: Boolean;
}
