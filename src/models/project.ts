import { IProjectSupportingChannel } from './project-supporting-channel';

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
