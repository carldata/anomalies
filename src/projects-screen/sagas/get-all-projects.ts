import * as _ from 'lodash';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { requests, IConfigurationEntry } from '../../requests';
import { IChannel, IProject } from '../../models';
import { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from '../../components/modal';
import { GET_ALL_PROJECTS_STARTED } from '../action-types';
import { GetAllProjectsFulfilledAction } from '../actions';
import { handleErrorInSaga } from '@common/handle-error-in-saga';
import { IState } from '../../state';
import { getCookie } from '@common/cookie-auxiliary';
import { checkResponseForError } from '@common/response-error-checking';

function* getAllProjectsAsyncCall() {
  try {
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction()));
    const token = getCookie('fw_jwt');
    let response = yield requests.getConfiguration();
    response = checkResponseForError(response);
    yield put(_.toPlainObject(new GetAllProjectsFulfilledAction(_.map(response, (el) => ({ ...el.data, id: el.id } as IProject)))));
    yield put(_.toPlainObject(new HideGeneralMessageModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(GET_ALL_PROJECTS_STARTED, getAllProjectsAsyncCall);
}