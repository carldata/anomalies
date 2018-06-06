import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IChannel, ISite, ISitesChannels } from '../../model';

function* showAddChannel(action) {
  try {
    yield put({type: anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_FETCHING});
    const sites: ISite[] = yield Requests.getSites('FlowMetrix');
    const channels: IChannel[] = yield Requests.getChannels(_.head(sites).id);
    yield put({
       type: anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_FULFILED,
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
  yield takeEvery(anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_START, showAddChannel);
}
