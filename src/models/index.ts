export interface IChannel {
    id: string;
    name: string;
    type: string;
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

export interface IProjectsScreenState {
    projects: IProject[];
    sites: ISite[];
    channels: IChannel[];
    showModal: boolean;
}

export interface IProjectSupportingChannel {
    site: string;
    siteId: string;
    channel: string;
    channelId: string;
    type: string;
}

export interface IShowAddChannelPayload {
    sites: ISite[];
    channels: IChannel[];
    mainChartEmpty: boolean;
}

export interface ISite {
    id: string;
    name: string;
}

export interface ISiteChannelInfo {
    site: string;
    channel: string;
    type: string;
}

export interface ISitesChannels {
    sites: ISite[];
    channels: IChannel[];
}