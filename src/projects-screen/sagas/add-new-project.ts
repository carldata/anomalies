import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IProject } from '../state';
import { AddProjectStartAction, AddProjectFulfiledAction } from '../actions';

function* addNewProject(action: AddProjectStartAction) {
  try {
    const id: string = yield Requests.addProject(action.payload);
    const project = { ...action.payload, id } as IProject;
    yield put(_.toPlainObject(new AddProjectFulfiledAction(project)));
  } catch (error) {
    // todo notify error occured
  }
}

export function* watchAddNewProject() {
  yield takeEvery<AddProjectStartAction>(projectsScreenActionTypes.ADD_PROJECT_START, addNewProject);
}