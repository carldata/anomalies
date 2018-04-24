import axios from 'axios';
import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from './action-creators';
import { IProject } from './state';
import { Requests } from '../requests';
import { IState } from '../state';
import { IModalProject } from '../projects-screen/controls/add-project-modal/index';

export function* watchGoToAnomalies() {
  yield takeEvery(projectsScreenActionTypes.GO_TO_ANOMALIES, function* () { yield put(push('/anomalies')); });
}

function* getAllProjectsAsyncCall() {
  try {
    var projectsArray = [];
    const response = yield Requests.getConfiguration()

    for (let element of response.data) {
      projectsArray.push({ id: element.id, name: element.data.name })
    }

    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED, payload: projectsArray });
  } catch (error) {
    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_REJECTED, payload: error.message });
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START, getAllProjectsAsyncCall);
}

export function* addNewProject(action) {
  try {
    let projectId: string = yield Requests.addProject(action.payload);
    yield put({
      type: projectsScreenActionTypes.ADD_PROJECT_FULFILED, payload: {
        id: projectId,
        name: (action.payload as IModalProject).name,
        site: (action.payload as IModalProject).site,
        final: (action.payload as IModalProject).final,
        raw: (action.payload as IModalProject).raw,
  } as IProject
    });
  } catch (error) {
    //todo notify error occured
  }
}

export function* watchAddNewProject() {
  yield takeEvery(projectsScreenActionTypes.ADD_PROJECT_START, addNewProject)
}