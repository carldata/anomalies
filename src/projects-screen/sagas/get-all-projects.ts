import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IChannel } from '../../model';
import { IProject } from '../state';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { GetAllProjectsFullfilledAction, GetAllProjectsRejectedAction } from '../actions';
import { GET_ALL_PROJECTS_ASYNC_CALL_START } from '../action-types';

function* getAllProjectsAsyncCall() {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    const projects: IProject[] = yield Requests.getConfiguration();
    yield put(_.toPlainObject(new GetAllProjectsFullfilledAction(projects)));
    yield put(_.toPlainObject(new HideModalAction()));
  } catch (error) {
    yield put(_.toPlainObject(new GetAllProjectsRejectedAction()));
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(GET_ALL_PROJECTS_ASYNC_CALL_START, getAllProjectsAsyncCall);
}