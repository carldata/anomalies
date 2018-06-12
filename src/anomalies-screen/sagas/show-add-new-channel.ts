import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { requests } from '../../requests';
import { IShowAddChannelPayload } from '../models/show-add-channel-payload';
import { ISite, IChannel } from '@models/.';

function* showAddChannel(action) {
  try {
    yield put({type: anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_FETCHING});
    const sites: ISite[] = yield requests.getSites('Emerald_AECOM');
    const channels: IChannel[] = yield requests.getChannels(_.head(sites).id);
    yield put({
       type: anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_FULFILED,
       payload: {
         sites,
         channels,
         mainChartEmpty: action.payload,
       } as IShowAddChannelPayload,
      });
  } catch (error) {
    // todo notify when error occurs
  }
}

export function* watchShowAddNewChannel() {
  yield takeEvery(anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_START, showAddChannel);
}
