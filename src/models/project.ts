import { ISupportingChannel } from './supporting-channel';

export interface IProject {
  id: string;
  projectName: string;
  siteName: string;
  siteId: string;
  rawChannelName: string;
  rawChannelId: string;
  finalChannelName: string;
  finalChannelId: string;
  rainfallSiteName?: string;
  rainfallSiteId?: string;
  rainfallChannelName?: string;
  rainfallChannelId?: string;
  supportingChannels?: ISupportingChannel[];
}
