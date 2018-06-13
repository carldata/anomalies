import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { requests } from '../../requests';
import { IChannel } from '../../models';

function* getChannelsForSite(action) {
  try {
    yield put({ type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_FETCHING });
    const channels: IChannel[] = yield requests.getChannels(action.payload);
    yield put({ type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_FULFILED, payload: channels });
  } catch (error) {
    // todo notify error
  }
}

export function* watchGetChannelsForSiteAnomalies() {
  yield takeEvery(anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_START, getChannelsForSite);
}