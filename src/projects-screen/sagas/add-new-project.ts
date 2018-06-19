import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { AddProjectStartedAction, AddProjectFulfilledAction } from '../actions';
import { ADD_PROJECT_STARTED } from '../action-types';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* addNewProject(action: AddProjectStartedAction) {
  try {
    const id: string = yield requests.addProject(action.payload);
    yield put(_.toPlainObject(new AddProjectFulfilledAction({ ...action.payload, id })));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchAddNewProject() {
  yield takeEvery<AddProjectStartedAction>(ADD_PROJECT_STARTED, addNewProject);
}