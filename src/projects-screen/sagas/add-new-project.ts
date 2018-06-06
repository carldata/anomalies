import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IProject } from '../state';

function* addNewProject(action) {
  try {
    const projectId: string = yield Requests.addProject(action.payload);
    yield put({
      type: projectsScreenActionTypes.ADD_PROJECT_FULFILED, payload: _.extend({}, action.payload, { id: projectId } as IProject),
    });
  } catch (error) {
    // todo notify error occured
  }
}

export function* watchAddNewProject() {
  yield takeEvery(projectsScreenActionTypes.ADD_PROJECT_START, addNewProject);
}