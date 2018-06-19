import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { GO_TO_PROJECTS } from '../action-types';

export function* watchGoToProjects() {
  yield takeEvery(GO_TO_PROJECTS, function* () { yield put(push('/projects')); });
}