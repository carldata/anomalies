import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { Requests } from '../../requests';
import { IProject } from '../models/project';
import { AddProjectStartedAction, AddProjectFulfilledAction } from '../actions';
import { ADD_PROJECT_STARTED } from '../action-types';

function* addNewProject(action: AddProjectStartedAction) {
  try {
    const id: string = yield Requests.addProject(action.payload);
    yield put(_.toPlainObject(new AddProjectFulfilledAction({ ...action.payload, id })));
  } catch (error) {
    // todo notify error occured
  }
}

export function* watchAddNewProject() {
  yield takeEvery<AddProjectStartedAction>(ADD_PROJECT_STARTED, addNewProject);
}