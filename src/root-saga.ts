import { all, fork } from 'redux-saga/effects'
import { watchGoToAnomalies, watchTestAsyncCall } from './projects-screen/sagas'
import { watchGoToProjects } from './anomalies-screen/sagas'


export function* rootSaga() {
  return yield all([
    fork(watchTestAsyncCall),
    fork(watchGoToAnomalies),
    fork(watchGoToProjects)
  ])
} 