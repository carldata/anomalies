import { all, fork } from 'redux-saga/effects';
import { watchGoToProjects } from './anomalies-screen/sagas';
import { watchGoToAnomalies, watchGetAllProjectsAsyncCall } from './projects-screen/sagas';


export function* rootSaga() {
  return yield all([
    fork(watchGoToAnomalies),
    fork(watchGoToProjects),
    fork(watchGetAllProjectsAsyncCall)
  ]);
}