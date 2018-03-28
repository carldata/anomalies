import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

export const projectsScreenActionTypes = {
  GO_TO_ANOMALIES : 'GO_TO_ANOMALIES',
  GET_ALL_PROJECTS_ASYNC_CALL_START : 'GET_ALL_PROJECTS_ASYNC_CALL_START',
  GET_ALL_PROJECTS_ASYNC_CALL_FULFILED: 'GET_ALL_PROJECTS_ASYNC_CALL_FULFILED',
  GET_ALL_PROJECTS_ASYNC_CALL_REJECTED: 'GET_ALL_PROJECTS_ASYNC_CALL_REJECTED'
};

export const projectScreenActionCreators = {
  goToAnomaliesScreen: (name: string) => {
    return { type: projectsScreenActionTypes.GO_TO_ANOMALIES, payload: name };
  },
  getAllProjectsAsyncCall: () => {
    return { type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START }
  }
};