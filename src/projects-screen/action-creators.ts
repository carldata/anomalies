import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { IProject } from './state';

export const projectsScreenActionTypes = {
  GO_TO_ANOMALIES: 'GO_TO_ANOMALIES',
  GET_ALL_PROJECTS_ASYNC_CALL_START: 'GET_ALL_PROJECTS_ASYNC_CALL_START',
  GET_ALL_PROJECTS_ASYNC_CALL_FULFILED: 'GET_ALL_PROJECTS_ASYNC_CALL_FULFILED',
  GET_ALL_PROJECTS_ASYNC_CALL_REJECTED: 'GET_ALL_PROJECTS_ASYNC_CALL_REJECTED',
  ADD_PROJECT_START: 'ADD_PROJECT_START',
  ADD_PROJECT_FETCHING: 'ADD_PROJECT_FETCHING',
  ADD_PROJECT_FULFILED: 'ADD_PROJECT_FULFILED',
  ADD_PROJECT_REJECTED: 'ADD_PROJECT_REJECTED',
  GET_SITES_FOR_PROJECT_START: 'GET_SITES_FOR_PROJECT_START',
  GET_SITES_FOR_PROJECT_FETCHING: 'GET_SITES_FOR_PROJECT_FETCHING',
  GET_SITES_FOR_PROJECT_FULFILED: 'GET_SITES_FOR_PROJECT_FULFILED',
  GET_SITES_FOR_PROJECT_REJECTED: 'GET_SITES_FOR_PROJECT_REJECTED',
  GET_CHANNELS_FOR_SITE_START: 'GET_CHANNELS_FOR_SITE_START',
  GET_CHANNELS_FOR_SITE_FETCHING: 'GET_CHANNELS_FOR_SITE_FETCHING',
  GET_CHANNELS_FOR_SITE_FULFILED: 'GET_CHANNELS_FOR_SITE_FULFILED',
  GET_CHANNELS_FOR_SITE_REJECTED: 'GET_CHANNELS_FOR_SITE_REJECTED',
};

export const projectScreenActionCreators = {
  goToAnomaliesScreen: (project: IProject) => {
    return { type: projectsScreenActionTypes.GO_TO_ANOMALIES, payload: project };
  },
  getAllProjectsAsyncCall: () => {
    return { type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START };
  },
  addProjectStart: (project: IProject) => {
    return { type: projectsScreenActionTypes.ADD_PROJECT_START, payload: project};
  },
  getSites: (db: string) => {
    return { type: projectsScreenActionTypes.GET_SITES_FOR_PROJECT_START, payload: db };
  },
  getChannels: (siteId: string) => {
    return { type: projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_START, payload: siteId };
  },
};