import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { put } from 'redux-saga/effects';

export const anomaliesScreenActionTypes = {
  ANOMALY_TEST_ACTION: 'ANOMALY_TEST_ACTION',
  GO_TO_PROJECTS: 'GO_TO_PROJECTS',
};

export const anomaliesScreenActionCreators = {
  goToProjectsScreen: () => {
    return { type: anomaliesScreenActionTypes.GO_TO_PROJECTS };
  },
};