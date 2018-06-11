import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IChannel } from '../../models';

function* getChannelsForSite(action) {
  try {
    yield put({ type: projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_FETCHING });
    const channels: IChannel[] = yield Requests.getChannels(action.payload);
    yield put({ type: projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_FULFILED, payload: channels });
  } catch (error) {
    // todo notify error
  }
}

export function* watchGetChannelsForSite() {
  yield takeEvery(projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_START, getChannelsForSite);
}