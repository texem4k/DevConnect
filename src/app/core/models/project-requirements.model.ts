export type DeveloperLevel = "Junior" | "Mid" | "Senior";

export interface ProjectRequirements {
  technologies: Technology[];
  knowledgeAreas: string[];
  level: DeveloperLevel;
}
