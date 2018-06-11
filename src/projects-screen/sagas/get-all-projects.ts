import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { Requests } from '../../requests';
import { IChannel } from '../../model';
import { IProject } from '../models/project';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { GetAllProjectsFulfilledAction, GetAllProjectsRejectedAction } from '../actions';
import { GET_ALL_PROJECTS_STARTED } from '../action-types';

interface IConfigurationEntry {
  id: string;
  data: IProject;
}

function* getAllProjectsAsyncCall() {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    const response: IConfigurationEntry[] = yield Requests.getConfiguration();
    yield put(_.toPlainObject(new GetAllProjectsFulfilledAction(_.map(response, (el) => el.data))));
    yield put(_.toPlainObject(new HideModalAction()));
  } catch (error) {
    yield put(_.toPlainObject(new GetAllProjectsRejectedAction()));
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(GET_ALL_PROJECTS_STARTED, getAllProjectsAsyncCall);
}