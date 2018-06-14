import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { requests } from '../../requests';
import { IChannel } from '../../models';
import { ShowModalAction, HideModalAction } from '../../components/modal';

function* getChannelsForSite(action) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    yield put({ type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_FETCHING });
    const channels: IChannel[] = yield requests.getChannels(action.payload);
    yield put({ type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_FULFILLED, payload: channels });
  } catch (error) {
    // todo notify error
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  }
}

export function* watchGetChannelsForSiteAnomalies() {
  yield takeEvery(anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_START, getChannelsForSite);
}