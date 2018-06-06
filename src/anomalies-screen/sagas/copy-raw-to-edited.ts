import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';

function* copyRawToEdited() {
  yield put({ type: anomaliesScreenActionTypes.COPY_RAW_TO_EDITED, payload: '' });
}

export function* watchCopyRawToEdited() {
  yield takeEvery(anomaliesScreenActionTypes.COPY_RAW_TO_EDITED, copyRawToEdited);
}