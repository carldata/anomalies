import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { IModalProject } from '../projects-screen/controls/add-project-modal/index';
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
};

export const projectScreenActionCreators = {
  goToAnomaliesScreen: (project: IProject) => {
    return { type: projectsScreenActionTypes.GO_TO_ANOMALIES, payload: project };
  },
  getAllProjectsAsyncCall: () => {
    return { type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START }
  },
  addProjectStart: (project: IModalProject) => {
    return { type: projectsScreenActionTypes.ADD_PROJECT_START, payload: project}
  }
};