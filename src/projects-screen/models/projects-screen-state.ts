import { IChannel, IProject, ISite } from '@models/.';

export interface IProjectsScreenState {
  projects: IProject[];
  sites: ISite[];
  channels: IChannel[];
  showModal: boolean;
}