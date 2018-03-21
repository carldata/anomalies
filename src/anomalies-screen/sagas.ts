import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { anomaliesScreenActionTypes } from './action-creators'

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function* () { yield put(push("/projects")) })
}