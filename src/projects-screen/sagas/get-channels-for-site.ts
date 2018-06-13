import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { IChannel } from '../../models';
import { GET_CHANNELS_FOR_SITE_STARTED } from '../action-types';
import { GetChannelsForSiteFetchingAction, GetChannelsForSiteFulfilledAction } from '../actions';
import { ShowModalAction, HideModalAction } from '../../components/modal';

function* getChannelsForSite(action) {
  try {
    yield put(_.toPlainObject(new GetChannelsForSiteFetchingAction()));
    const channels: IChannel[] = yield requests.getChannels(action.payload);
    yield put(_.toPlainObject(new GetChannelsForSiteFulfilledAction(channels)));
  } catch (error) {
    // todo notify error
  }
}

export function* watchGetChannelsForSite() {
  yield takeEvery(GET_CHANNELS_FOR_SITE_STARTED, getChannelsForSite);
}