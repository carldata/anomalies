import * as _ from 'lodash';
import { put, takeEvery, select } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { requests } from '../../requests';
import { IShowAddChannelPayload } from '../models/show-add-channel-payload';
import { ISite, IChannel } from '@models/.';
import { IState } from '../../state';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { config } from '../../config';

function* showAddChannel(action) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    const numberOfSupportedChannels = yield select((state: IState) => state.anomaliesScreen.timeSeries.supportingChannels.length);
    if (numberOfSupportedChannels >= config.anomaliesScreen.MAX_NUMBER_OF_SUPPORTED_CHANNELS) {
      yield put(_.toPlainObject(new ShowModalAction('Error', `There are currently currently ${config.anomaliesScreen.MAX_NUMBER_OF_SUPPORTED_CHANNELS} ` +
                                                    'additional channels added, which is the maximum', true)));
      return;
    }
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
    yield put(_.toPlainObject(new HideModalAction()));
  } catch (error) {
    yield put(_.toPlainObject(new HideModalAction()));
    // todo notify when error occurs
  }
}

export function* watchShowAddNewChannel() {
  yield takeEvery(anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_START, showAddChannel);
}
