import * as _ from 'lodash';
import { takeEvery, call, all, put, select } from 'redux-saga/effects';
import { BackendOperationErrorAction } from './actions';

export function* handleErrorInSaga(error) {
  if (error instanceof TypeError) {
    yield put(_.toPlainObject(new BackendOperationErrorAction(JSON.stringify(error.message))));
    return;
  }
  yield put(_.toPlainObject(new BackendOperationErrorAction(_.toString(error))));
}