import * as _ from 'lodash';
import { push } from 'react-router-redux';
import { put } from 'redux-saga/effects';
import { BackendOperationErrorAction } from '@common/handle-error-in-saga/actions';
import { ShowGeneralMessageModalAction } from '../../components/modal';
import { setCookie } from '@common/cookie-auxiliary';

export function* handleErrorInSaga(error) {
  // if (error instanceof Error) {
  //   yield put(_.toPlainObject(new BackendOperationErrorAction(JSON.stringify(error.message))));
  //   yield put(_.toPlainObject(new ShowGeneralMessageModalAction('An error occurred', `Details: ${error.message}`, true)));
  //   return;
  // }
  // yield put(_.toPlainObject(new BackendOperationErrorAction(_.toString(error))));
  // yield put(_.toPlainObject(new ShowGeneralMessageModalAction('An error occurred', _.toString(error), true)));

  const errorMessage = error instanceof Error ? JSON.stringify(error.message) : _.toString(error);
  if (_.trim(errorMessage) === 'Token is invalid') {
    setCookie('fw_jwt', '', -100);
    yield put(push('/login'));
  } else {
    yield put(_.toPlainObject(new BackendOperationErrorAction(errorMessage)));
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction('An error occurred', errorMessage, true)));
  }

}