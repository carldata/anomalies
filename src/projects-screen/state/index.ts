export interface IProjectsScreenState {
  projects: IProject[];
}

export interface IProject {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  splitDate: string;
}