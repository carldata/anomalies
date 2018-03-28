import axios from 'axios';
import * as Papa from 'papaparse';
import { push } from 'react-router-redux';
import { takeEvery } from 'redux-saga/effects';
import { put } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from './action-creators';

const apiUrl = 'http://13.91.93.221:8080';

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function*() { yield put(push('/projects')); });
}

function* getAnomaliesForChannel(action: any) {

  try {
    //const timeseriesResponse = yield axios.get(`${apiUrl}/data/channel/${action.payload}/data`);
    const anomaliesResponse = yield axios.get(`${apiUrl}/anomalies/find?series=${action.payload}`);
    //const parsedtimeseries = Papa.parse(timeseriesResponse.data, { header: true});
    const parsedAnomalies = Papa.parse(anomaliesResponse.data, { header: true});
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_FULFILED, payload: [parsedAnomalies] });
  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_REJECTED, payload: error.message });
  }
}

export function* watchGetAnomaliesForChannel() {
  yield takeEvery(anomaliesScreenActionTypes.GET_ANOMALIES_START, getAnomaliesForChannel);
}