import { ISite } from './site';
import { IChannel } from './channel';

export interface ISitesChannels {
  sites: ISite[];
  channels: IChannel[];
}