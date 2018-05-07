export interface IProjectsScreenState {
  projects: IProject[];
}

export interface IProject {
  id: string;
  name: string;
  site: string;
  raw: string;
  final: string;
  supportingChannels?: { site: string, channel: string, type: string }[];
}