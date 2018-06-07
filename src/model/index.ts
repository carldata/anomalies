export interface ISite {
  id: string;
  name: string;
}

export interface IChannel {
  id: string;
  name: string;
}

export interface ISitesChannels {
  sites: ISite[];
  channels: IChannel[];
}

export interface IShowAddChannelPayload {
  sites: ISite[];
  channels: IChannel[];
  mainChartEmpty: boolean;
}