import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from '../../components/modal';
import { SaveProjectFulfilledAction, SaveProjectStartAction } from '../actions';
import { SAVE_PROJECT_START } from '../action-types';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* saveProject(action: SaveProjectStartAction) {
  try {
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction()));
    yield requests().saveProject(action.payload);
    yield put(_.toPlainObject(new SaveProjectFulfilledAction(action.payload)));
    yield put(_.toPlainObject(new HideGeneralMessageModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchSaveProject() {
  yield takeEvery(SAVE_PROJECT_START, saveProject);
}