import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';

function* addEmptyChannel(action: any) {
  yield put({ type: anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL, payload: action.payload });
}

export function* watchAddEmptyChannel() {
  yield takeEvery(anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL_START, addEmptyChannel);
}