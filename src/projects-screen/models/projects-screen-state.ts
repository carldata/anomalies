import { IChannel, IProject, ISite } from '@models/.';

export enum EnumProjectModalMode {
  Hidden,
  AddNew,
  Edit,
}

export interface IProjectsScreenState {
  projects: IProject[];
  sites: ISite[];
  channels: IChannel[];
  mode: EnumProjectModalMode;
  editedProject: IProject;
}