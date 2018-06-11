import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IChannel, ISitesChannels, ISite } from '../../models';

function* showAddProject(action) {
  try {
    yield put({type: projectsScreenActionTypes.SHOW_ADD_PROJECT_FETCHING});
    const sites: ISite[] = yield Requests.getSites('Emerald_AECOM');
    const channels: IChannel[] = yield Requests.getChannels(_.head(sites).id);
    yield put({
       type: projectsScreenActionTypes.SHOW_ADD_PROJECT_FULFILED,
       payload: {
         sites,
         channels,
       } as ISitesChannels,
      });
  } catch (error) {
    // todo notify when error occurs
  }
}

export function* watchShowAddNewProject() {
  yield takeEvery(projectsScreenActionTypes.SHOW_ADD_PROJECT_START, showAddProject);
}
