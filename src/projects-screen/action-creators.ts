import { IProject } from '../models/project';
import { GetAllProjectsAction } from './actions';
import _ = require('lodash');

// TODO: move to action-types
export const projectsScreenActionTypes = {
  GO_TO_ANOMALIES: 'GO_TO_ANOMALIES',
  SHOW_ADD_PROJECT_START: 'SHOW_ADD_PROJECT_START',
  SHOW_ADD_PROJECT_FETCHING: 'SHOW_ADD_PROJECT_FETCHING',
  SHOW_ADD_PROJECT_FULFILED: 'SHOW_ADD_PROJECT_FULFILED',
  SHOW_ADD_PROJECT_REJECTED: 'SHOW_ADD_PROJECT_REJECTED',
  CANCEL_SHOW_ADD_PROJECT: 'CANCEL_SHOW_ADD_PROJECT',
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

type IGetAllProjectsActionCreator = () => GetAllProjectsAction;

const getAllProjects: IGetAllProjectsActionCreator = () =>
  _.toPlainObject(new GetAllProjectsAction());


// TODO: refactor this the way Auto I&I works
export const projectScreenActionCreators = {
  goToAnomaliesScreen: (project: IProject) => {
    return { type: projectsScreenActionTypes.GO_TO_ANOMALIES, payload: project };
  },
  showAddProject: () => {
    return { type: projectsScreenActionTypes.SHOW_ADD_PROJECT_START };
  },
  cancelShowAddProject: () => {
    return { type: projectsScreenActionTypes.CANCEL_SHOW_ADD_PROJECT };
  },
  addProjectStart: (project: IProject) => {
    return { type: projectsScreenActionTypes.ADD_PROJECT_START, payload: project };
  },
  getSites: (db: string) => {
    return { type: projectsScreenActionTypes.GET_SITES_FOR_PROJECT_START, payload: db };
  },
  getChannels: (siteId: string) => {
    return { type: projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_START, payload: siteId };
  },
};

export {
  IGetAllProjectsActionCreator,
  getAllProjects,
};