import * as _ from 'lodash';
import { put, takeEvery, select } from 'redux-saga/effects';
import { requests } from '../../requests';
import { IShowAddChannelPayload } from '../models/show-add-channel-payload';
import { ISite, IChannel } from '@models/.';
import { IState } from '../../state';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { config } from '../../config';
import { SHOW_SUPPORTING_CHANNEL_MODAL_START } from '../action-types';
import { ShowDefineChannelModalFulfilledAction } from '../actions';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* showDefineChannelModal(action) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    const numberOfSupportedChannels = yield select((state: IState) => state.anomaliesScreen.timeSeries.supportingChannels.length);
    if (numberOfSupportedChannels >= config.anomaliesScreen.MAX_NUMBER_OF_SUPPORTED_CHANNELS) {
      yield put(_.toPlainObject(new ShowModalAction('Error', `There are currently currently ${config.anomaliesScreen.MAX_NUMBER_OF_SUPPORTED_CHANNELS} ` +
                                                    'additional channels added, which is the maximum', true)));
      return;
    }
    const sites: ISite[] = yield requests.getSites('Emerald_AECOM');
    const channels: IChannel[] = yield requests.getChannels(_.head(sites).id);
    yield put(_.toPlainObject(new ShowDefineChannelModalFulfilledAction({
      sites,
      channels,
    })));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchShowDefineChannelModal() {
  yield takeEvery(SHOW_SUPPORTING_CHANNEL_MODAL_START, showDefineChannelModal);
}
