import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { Requests } from '../../requests';
import { IChannel, ISite, ISitesChannels } from '../../model';
import { ShowAddProjectFetchingAction, ShowAddProjectFulfilledAction } from '../actions';
import { SHOW_ADD_PROJECT_STARTED } from '../action-types';

function* showAddProject(action) {
  try {
    yield put(_.toPlainObject(new ShowAddProjectFetchingAction()));
    const sites: ISite[] = yield Requests.getSites('Emerald_AECOM');
    const channels: IChannel[] = yield Requests.getChannels(_.head(sites).id);
    yield put(_.toPlainObject(new ShowAddProjectFulfilledAction({ sites, channels })));
  } catch (error) {
    // todo notify when error occurs
  }
}

export function* watchShowAddNewProject() {
  yield takeEvery(SHOW_ADD_PROJECT_STARTED, showAddProject);
}