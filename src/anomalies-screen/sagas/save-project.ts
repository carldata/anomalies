import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { requests } from '../../requests';
import { ShowModalAction, HideModalAction } from '../../components/modal';

function* saveProject(action) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    yield put({type: anomaliesScreenActionTypes.SAVE_PROJECT_FETCHING});
    yield requests.saveProject(action.payload);
    yield put({type: anomaliesScreenActionTypes.SAVE_PROJECT_FULFILED});
  } catch(error) {
    yield put({type: anomaliesScreenActionTypes.SAVE_PROJECT_REJECTED});
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  }
}

export function* watchSaveProject() {
  yield takeEvery(anomaliesScreenActionTypes.SAVE_PROJECT_START, saveProject);
}