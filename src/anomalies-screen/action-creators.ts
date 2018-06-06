import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { put } from 'redux-saga/effects';
import { IProject } from '../projects-screen/state';

export const anomaliesScreenActionTypes = {
  GO_TO_PROJECTS: 'GO_TO_PROJECTS',
  GET_ANOMALIES_START: 'GET_ANOMALIES_START',
  GET_ANOMALIES_FETCHING: 'GET_ANOMALIES_FETCHING',
  GET_ANOMALIES_FOR_CHART_FULFILED: 'GET_ANOMALIES_FOR_CHART_FULFILED',
  GET_ANOMALIES_FOR_GRID_FULFILED: 'GET_ANOMALIES_FOR_GRID_FULFILED',
  GET_ANOMALIES_REJECTED: 'GET_ANOMALIES_REJECTED',
  ADD_AND_POPULATE_CHANNEL_START: 'ADD_AND_POPULATE_CHANNEL_START',
  ADD_AND_POPULATE_CHANNEL_FETCHING: 'ADD_AND_POPULATE_CHANNEL_FETCHING',
  ADD_AND_POPULATE_CHANNEL_FULFILED: 'ADD_AND_POPULATE_CHANNEL_FULFILED',
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
  GET_SITES_FOR_PROJECT_ANOMALIES_START: 'GET_SITES_FOR_PROJECT_ANOMALIES_START',
  GET_SITES_FOR_PROJECT_ANOMALIES_FETCHING: 'GET_SITES_FOR_PROJECT_ANOMALIES_FETCHING',
  GET_SITES_FOR_PROJECT_ANOMALIES_FULFILED: 'GET_SITES_FOR_PROJECT_ANOMALIES_FULFILED',
  GET_SITES_FOR_PROJECT_ANOMALIES_REJECTED: 'GET_SITES_FOR_PROJECT_ANOMALIES_REJECTED',
  GET_CHANNELS_FOR_SITE_ANOMALIES_START: 'GET_CHANNELS_FOR_SITE_ANOMALIES_START',
  GET_CHANNELS_FOR_SITE_ANOMALIES_FETCHING: 'GET_CHANNELS_FOR_SITE_ANOMALIES_FETCHING',
  GET_CHANNELS_FOR_SITE_ANOMALIES_FULFILED: 'GET_CHANNELS_FOR_SITE_ANOMALIES_FULFILED',
  GET_CHANNELS_FOR_SITE_ANOMALIES_REJECTED: 'GET_CHANNELS_FOR_SITE_ANOMALIES_REJECTED',
  SHOW_ADD_CHANNEL_START: 'SHOW_ADD_CHANNEL_START',
  SHOW_ADD_CHANNEL_FETCHING: 'SHOW_ADD_CHANNEL_FETCHING',
  SHOW_ADD_CHANNEL_FULFILED: 'SHOW_ADD_CHANNEL_FULFILED',
  SHOW_ADD_CHANNEL_REJECTED: 'SHOW_ADD_CHANNEL_REJECTED',
  CANCEL_SHOW_ADD_CHANNEL: 'CANCEL_SHOW_ADD_CHANNEL',
};

export const anomaliesScreenActionCreators = {
  getAnomaliesForProject: (projectInfo) => {
    return { type: anomaliesScreenActionTypes.GET_ANOMALIES_START, payload: projectInfo };
  },
  getSitesForProject: () => {
    return { type: anomaliesScreenActionTypes.GET_SITES_FOR_PROJECT_ANOMALIES_START };
  },
  getChannelsForSite: (siteId: string) => {
    return { type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_START, payload: siteId };
  },
  addAndPopulateChannel: (siteChannelInfo: any, startDate: string, endDate: string) => {
    return {
      type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_START,
      payload: {
        siteChannelInfo: siteChannelInfo,
        startDate: startDate,
        endDate: endDate,
      }
    }
  },
  addEmptyChannel: (siteChannelInfo: any, dateRangeUnixFrom: number, dateRangeUnixTo: number) => {
    return {
      type: anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL_START,
      payload: {
        siteChannelInfo: siteChannelInfo,
        dateRangeUnixFrom: dateRangeUnixFrom,
        dateRangeUnixTo: dateRangeUnixTo,
      }
    }
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
  showAddChannel: () => {
    return {
      type: anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_START,
    };
  },
  cancelShowAddChannel: () => {
    return {
      type: anomaliesScreenActionTypes.CANCEL_SHOW_ADD_CHANNEL,
    };
  },
};