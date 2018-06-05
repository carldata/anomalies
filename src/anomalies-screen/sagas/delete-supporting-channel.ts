import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';

function* deleteSupportingChannel(action) {
  yield put({ type: anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL, payload: action.payload });
}

export function* watchDeleteSupportingChannel() {
  yield takeEvery(anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL_START, deleteSupportingChannel);
}