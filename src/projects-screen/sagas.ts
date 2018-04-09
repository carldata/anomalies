import axios from 'axios';
import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from './action-creators';
import { IProject } from './state';
import { Requests } from '../requests';

export function* watchGoToAnomalies() {
  yield takeEvery(projectsScreenActionTypes.GO_TO_ANOMALIES, function*() { yield put(push('/anomalies')); });
}

function* getAllProjectsAsyncCall() {
  try
  {
    var projectsArray = [];
    const response = yield Requests.getConfiguration()
    
    for(let element of response.data){
      projectsArray.push({id: element.id, name: element.data.name})
    }

    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED, payload: projectsArray });
  } catch (error) {
    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_REJECTED, payload: error.message });
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START, getAllProjectsAsyncCall);
}