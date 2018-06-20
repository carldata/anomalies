import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { IChannel } from '../../models';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { GET_CHANNELS_FOR_SITE_START } from '../action-types';
import { GetChannelsForSiteFulfilledAction } from '../../projects-screen/actions';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* getChannelsForSite(action) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    const channels: IChannel[] = yield requests.getChannels(action.payload);
    yield put(_.toPlainObject(new GetChannelsForSiteFulfilledAction(channels)));
    yield put(_.toPlainObject(new HideModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchGetChannelsForSiteAnomalies() {
  yield takeEvery(GET_CHANNELS_FOR_SITE_START, getChannelsForSite);
}