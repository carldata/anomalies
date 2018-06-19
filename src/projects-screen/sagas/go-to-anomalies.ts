import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { GO_TO_ANOMALIES } from '../action-types';
import { PASS_PROJECT_TO_ANOMALIES } from '../../anomalies-screen/action-types';

function* goToAnomalies(action) {
  yield put({ type: PASS_PROJECT_TO_ANOMALIES, payload: action.payload });
  yield put(push('/anomalies'));
}

export function* watchGoToAnomalies() {
  yield takeEvery(GO_TO_ANOMALIES, goToAnomalies);
}