import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IProject } from '../models/project';
import { AddProjectStartAction, AddProjectFulfiledAction } from '../actions';

function* addNewProject(action: AddProjectStartAction) {
  try {
    const id: string = yield Requests.addProject(action.payload);
    yield put(_.toPlainObject(new AddProjectFulfiledAction({ ...action.payload, id })));
  } catch (error) {
    // todo notify error occured
  }
}

export function* watchAddNewProject() {
  yield takeEvery<AddProjectStartAction>(projectsScreenActionTypes.ADD_PROJECT_START, addNewProject);
}