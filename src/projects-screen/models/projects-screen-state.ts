import { IProject } from './project';
import { ISite, IChannel } from '../../model';

export interface IProjectsScreenState {
  projects: IProject[];
  sites: ISite[];
  channels: IChannel[];
  showModal: boolean;
}