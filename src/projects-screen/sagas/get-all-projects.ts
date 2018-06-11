import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { Requests } from '../../requests';
import { IProject } from '../../models/project';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { GetAllProjectsFullfilledAction, GetAllProjectsRejectedAction } from '../actions';
import { GET_ALL_PROJECTS_ASYNC_CALL_START } from '../action-types';

interface IConfigurationEntry {
  id: string;
  data: IProject;
}

function* getAllProjectsAsyncCall() {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    const response: IConfigurationEntry[] = yield Requests.getConfiguration();
    yield put(_.toPlainObject(new GetAllProjectsFullfilledAction(_.map(response, (el) => el.data))));
    yield put(_.toPlainObject(new HideModalAction()));
  } catch (error) {
    yield put(_.toPlainObject(new GetAllProjectsRejectedAction()));
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(GET_ALL_PROJECTS_ASYNC_CALL_START, getAllProjectsAsyncCall);
}