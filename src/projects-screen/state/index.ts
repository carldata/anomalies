import { ISite, IChannel } from '../../model';

export interface IProjectsScreenState {
  projects: IProject[];
  sites: ISite[];
  channels: IChannel[];
}

export interface IProject {
  id: string;
  name: string;
  site: string;
  siteId: string;
  raw: string;
  rawId: string;
  final: string;
  finalId: string;
  supportingChannels?: IProjectSupportingChannel[];
}

export interface IProjectSupportingChannel {
  site: string;
  siteId: string;
  channel: string;
  channelId: string;
  type: string;
}