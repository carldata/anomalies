import { IChannel, ISite } from '@models/.';

export interface IShowAddChannelPayload {
  sites: ISite[];
  channels: IChannel[];
  mainChartEmpty: boolean;
}