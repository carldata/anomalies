import * as _ from 'lodash';
import { push } from 'react-router-redux';
import { put } from 'redux-saga/effects';
import { BackendOperationErrorAction } from '@common/handle-error-in-saga/actions';
import { ShowGeneralMessageModalAction } from '../../components/modal';
import { setCookie } from '@common/cookie-auxiliary';

export function* handleErrorInSaga(error) {
  const errorMessage = error instanceof Error ? JSON.stringify(error.message) : _.toString(error);
  if (_.trim(errorMessage) === 'Token is invalid') {
    setCookie('fw_jwt', '', -100);
    yield put(push('/login'));
  } else {
    yield put(_.toPlainObject(new BackendOperationErrorAction(errorMessage)));
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction('An error occurred', errorMessage, true)));
  }

}