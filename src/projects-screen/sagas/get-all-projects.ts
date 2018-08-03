import * as _ from 'lodash';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { requests, IConfigurationEntry } from '../../requests';
import { IChannel, IProject } from '../../models';
import { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from '../../components/modal';
import { GET_ALL_PROJECTS_STARTED } from '../action-types';
import { GetAllProjectsFulfilledAction } from '../actions';
import { handleErrorInSaga } from '@common/handle-error-in-saga';
import { IState } from '../../state';

function* getAllProjectsAsyncCall() {
  try {
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction()));
    const token = yield select((state: IState) => state.configuration.token)
    const response: IConfigurationEntry[] = yield requests(token).getConfiguration();
    yield put(_.toPlainObject(new GetAllProjectsFulfilledAction(_.map(response, (el) => ({ ...el.data, id: el.id } as IProject)))));
    yield put(_.toPlainObject(new HideGeneralMessageModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(GET_ALL_PROJECTS_STARTED, getAllProjectsAsyncCall);
}