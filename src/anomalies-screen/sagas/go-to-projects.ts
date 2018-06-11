import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function* () { yield put(push('/projects')); });
}