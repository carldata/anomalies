import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { put } from 'redux-saga/effects';

export const anomaliesScreenActionTypes = {
  GO_TO_PROJECTS: 'GO_TO_PROJECTS',
  GET_ANOMALIES_START: 'GET_ANOMALIES_START',
  GET_ANOMALIES_FETCHING: 'GET_ANOMALIES_FETCHING',
  GET_ANOMALIES_FOR_CHART_FULFILED: 'GET_ANOMALIES_FOR_CHART_FULFILED',
  GET_ANOMALIES_FOR_GRID_FULFILED: 'GET_ANOMALIES_FOR_GRID_FULFILED',
  GET_ANOMALIES_REJECTED: 'GET_ANOMALIES_REJECTED',
  COPY_RAW_TO_EDITED: 'COPY_RAW_TO_EDITED',
  PASS_PROJECT_TO_ANOMALIES: 'PASS_PROJECT_TO_ANOMALIES',
};

export const anomaliesScreenActionCreators = {
  getAnomaliesForProject: (projectInfo) => {
    return { type: anomaliesScreenActionTypes.GET_ANOMALIES_START, payload: projectInfo };
  },
  goToProjectsScreen: () => {
    return { type: anomaliesScreenActionTypes.GO_TO_PROJECTS };
  },
  copyRawToEdited: () => {
    return { type: anomaliesScreenActionTypes.COPY_RAW_TO_EDITED };
  },
};