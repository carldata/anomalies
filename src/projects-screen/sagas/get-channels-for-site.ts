import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { IChannel } from '../../models';
import { GET_CHANNELS_FOR_SITE_STARTED } from '../action-types';
import { GetChannelsForSiteFetchingAction, GetChannelsForSiteFulfilledAction } from '../actions';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* getChannelsForSite(action) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    yield put(_.toPlainObject(new GetChannelsForSiteFetchingAction()));
    const channels: IChannel[] = yield requests.getChannels(action.payload);
    yield put(_.toPlainObject(new GetChannelsForSiteFulfilledAction(channels)));
  } catch (error) {
    yield handleErrorInSaga(error);
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  }
}

export function* watchGetChannelsForSite() {
  yield takeEvery(GET_CHANNELS_FOR_SITE_STARTED, getChannelsForSite);
}