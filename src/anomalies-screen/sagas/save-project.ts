import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { SaveProjectFulfilledAction, SaveProjectStartAction } from '../actions';
import { SAVE_PROJECT_START } from '../action-types';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* saveProject(action: SaveProjectStartAction) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    yield requests.saveProject(action.payload);
    yield put(_.toPlainObject(new SaveProjectFulfilledAction(action.payload)));
    yield put(_.toPlainObject(new HideModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchSaveProject() {
  yield takeEvery(SAVE_PROJECT_START, saveProject);
}