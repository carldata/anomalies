import { push } from 'react-router-redux';
import { takeEvery } from 'redux-saga/effects';
import { put } from 'redux-saga/effects';

import axios from 'axios';
import { anomaliesScreenActionTypes } from './action-creators';

const apiUrl = 'http://13.91.93.221:8080';

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function*() { yield put(push('/projects')); });
}

function* getAnomaliesForChannel(action: any) {
  const timeseriesResponse = yield axios.get(`${apiUrl}/data/channel/${action.payload}/data`);
  console.log('---TimeSeries---');
  console.log(timeseriesResponse.data);
  const anomaliesResponse = yield axios.get(`${apiUrl}/anomalies/find?series=${action.payload}`);
  console.log('---Anomalies---');
  console.log(anomaliesResponse.data);
}

export function* watchGetAnomaliesForChannel() {
  yield takeEvery(anomaliesScreenActionTypes.GET_ANOMALIES_START, getAnomaliesForChannel)
}