import { ISite, IChannel } from '../../model';

export interface IProjectsScreenState {
  projects: IProject[];
  sites: ISite[];
  channels: IChannel[];
  showModal: boolean;
}

export interface IProject {
  id: string;
  projectName: string;
  siteName: string;
  siteId: string;
  rawChannelName: string;
  rawChannelId: string;
  finalChannelName: string;
  finalChannelId: string;
  supportingChannels?: IProjectSupportingChannel[];
}

export interface IProjectSupportingChannel {
  site: string;
  siteId: string;
  channel: string;
  channelId: string;
  type: string;
}