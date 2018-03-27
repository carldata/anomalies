import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { put } from 'redux-saga/effects';

export const anomaliesScreenActionTypes = {
  ANOMALY_TEST_ACTION: 'ANOMALY_TEST_ACTION',
  GO_TO_PROJECTS: 'GO_TO_PROJECTS',
  GET_ANOMALIES_START: 'GET_ANOMALIES_START',
  GET_ANOMALIES_FETCHING: 'GET_ANOMALIES_FETCHING',
  GET_ANOMALIES_FULFILED: 'GET_ANOMALIES_FULFILED',
  GET_ANOMALIES_REJECTED: 'GET_ANOMALIES_REJECTED',
};

export const anomaliesScreenActionCreators = {
  getAnomaliesForChannel: (channel: string) =>{
    return { type: anomaliesScreenActionTypes.GET_ANOMALIES_START, payload: channel }
  },
  goToProjectsScreen: () => {
    return { type: anomaliesScreenActionTypes.GO_TO_PROJECTS };
  },
};