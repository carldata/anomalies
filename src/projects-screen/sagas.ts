import axios from 'axios';
import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from './action-creators';

const apiAddress = 'http://104.40.58.54:8080'; // this is only for testing purposes

export function* watchGoToAnomalies() {
  yield takeEvery(projectsScreenActionTypes.GO_TO_ANOMALIES, function*() { yield put(push('/anomalies')); });
}

function* testAsyncCall() {
  try {
    const response = yield axios.get(`${apiAddress}/items?app=real-time-job-tests`);
    const data = yield JSON.stringify(response.data);
    yield put({ type: projectsScreenActionTypes.TEST_ASYNC_CALL_FULFILED, payload: data });
  } catch (error) {
    yield put({ type: projectsScreenActionTypes.TEST_ASYNC_CALL_REJECTED, payload: error });
  }
}

export function* watchTestAsyncCall() {
  yield takeEvery(projectsScreenActionTypes.TEST_ASYNC_CALL_START, testAsyncCall);
}