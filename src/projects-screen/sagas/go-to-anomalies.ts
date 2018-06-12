import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../../anomalies-screen/action-creators';
import { GO_TO_ANOMALIES } from '../action-types';

function* goToAnomalies(action) {
  yield put({ type: anomaliesScreenActionTypes.PASS_PROJECT_TO_ANOMALIES, payload: action.payload });
  yield put(push('/anomalies'));
}

export function* watchGoToAnomalies() {
  yield takeEvery(GO_TO_ANOMALIES, goToAnomalies);
}