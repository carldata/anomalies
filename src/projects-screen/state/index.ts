export interface IProjectsScreenState {
  dummyText: string;
  projects: IProject[];
}

export interface IProject {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  splitDate: string;
}