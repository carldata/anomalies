import { ISiteChannelInfo, IProject } from "../models";

export const anomaliesScreenActionTypes = {
  GO_TO_PROJECTS: 'GO_TO_PROJECTS',
  GET_TIME_SERIES_START: 'GET_TIME_SERIES_START',
  GET_TIME_SERIES_FETCHING: 'GET_TIME_SERIES_FETCHING',
  GET_TIME_SERIES_FULFILLED: 'GET_TIME_SERIES_FULFILLED',
  GET_TIME_SERIES_REJECTED: 'GET_TIME_SERIES_REJECTED',
  ADD_AND_POPULATE_CHANNEL_START: 'ADD_AND_POPULATE_CHANNEL_START',
  ADD_AND_POPULATE_CHANNEL_FETCHING: 'ADD_AND_POPULATE_CHANNEL_FETCHING',
  ADD_AND_POPULATE_CHANNEL_FULFILLED: 'ADD_AND_POPULATE_CHANNEL_FULFILLED',
  ADD_AND_POPULATE_CHANNEL_REJECTED: 'ADD_AND_POPULATE_CHANNEL_REJECTED',
  ADD_EMPTY_CHANNEL_START: 'ADD_EMPTY_CHANNEL_START',
  ADD_EMPTY_CHANNEL: 'ADD_EMPTY_CHANNEL',
  COPY_RAW_TO_EDITED: 'COPY_RAW_TO_EDITED',
  PASS_PROJECT_TO_ANOMALIES: 'PASS_PROJECT_TO_ANOMALIES',
  DELETE_SUPPORTING_CHANNEL_START: 'DELETE_SUPPORTING_CHANNEL_START',
  DELETE_SUPPORTING_CHANNEL: 'DELETE_SUPPORTING_CHANNEL',
  SAVE_PROJECT_START: 'SAVE_PROJECT_START',
  SAVE_PROJECT_FETCHING: 'SAVE_PROJECT_FETCHING',
  SAVE_PROJECT_FULFILED: 'SAVE_PROJECT_FULFILED',
  SAVE_PROJECT_REJECTED: 'SAVE_PROJECT_REJECTED',
  GET_CHANNELS_FOR_SITE_START: 'GET_CHANNELS_FOR_SITE_START',
  GET_CHANNELS_FOR_SITE_FETCHING: 'GET_CHANNELS_FOR_SITE_FETCHING',
  GET_CHANNELS_FOR_SITE_FULFILLED: 'GET_CHANNELS_FOR_SITE_FULFILLED',
  GET_CHANNELS_FOR_SITE_REJECTED: 'GET_CHANNELS_FOR_SITE_REJECTED',
  SHOW_ADD_CHANNEL_START: 'SHOW_ADD_CHANNEL_START',
  SHOW_ADD_CHANNEL_FETCHING: 'SHOW_ADD_CHANNEL_FETCHING',
  SHOW_ADD_CHANNEL_FULFILED: 'SHOW_ADD_CHANNEL_FULFILED',
  SHOW_ADD_CHANNEL_REJECTED: 'SHOW_ADD_CHANNEL_REJECTED',
  CANCEL_SHOW_ADD_CHANNEL: 'CANCEL_SHOW_ADD_CHANNEL',
};

export const anomaliesScreenActionCreators = {
  getTimeSeries: (projectInfo) => {
    return { type: anomaliesScreenActionTypes.GET_TIME_SERIES_START, payload: projectInfo };
  },
  getChannelsForSite: (siteId: string) => {
    return { type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_START, payload: siteId };
  },
  addAndPopulateChannel: (siteChannelInfo: ISiteChannelInfo, unixFrom: number, unixTo: number) => {
    return {
      type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_START,
      payload: {
        siteChannelInfo,
        unixFrom,
        unixTo,
      },
    };
  },
  addEmptyChannel: (siteChannelInfo: ISiteChannelInfo) => {
    return {
      type: anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL_START,
      payload: {
        siteChannelInfo,
      },
    };
  },
  goToProjectsScreen: () => {
    return { type: anomaliesScreenActionTypes.GO_TO_PROJECTS };
  },
  copyRawToEdited: () => {
    return { type: anomaliesScreenActionTypes.COPY_RAW_TO_EDITED };
  },
  deleteSupportingChannel: (idx) => {
    return {
      type: anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL_START,
      payload: idx,
    };
  },
  saveProject: (project: IProject) => {
    return {
      type: anomaliesScreenActionTypes.SAVE_PROJECT_START,
      payload: project,
    };
  },
  showAddChannelModal: (mainChartEmpty: boolean) => {
    return {
      type: anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_START,
      payload: mainChartEmpty,
    };
  },
  cancelShowAddChannel: () => {
    return {
      type: anomaliesScreenActionTypes.CANCEL_SHOW_ADD_CHANNEL,
    };
  },
};