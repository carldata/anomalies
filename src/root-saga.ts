import { all, fork } from 'redux-saga/effects';
import { watchDeleteSupportingChannel, watchAddEmptyChannel, watchAddAndPopulateChannel, watchGetAnomaliesForChannel, watchGoToProjects, watchCopyRawToEdited } from './anomalies-screen/sagas';
import { watchGoToAnomalies, watchGetAllProjectsAsyncCall, watchAddNewProject } from './projects-screen/sagas';

export function* rootSaga() {
  return yield all([
    fork(watchGoToAnomalies),
    fork(watchGoToProjects),
    fork(watchGetAnomaliesForChannel),
    fork(watchGetAllProjectsAsyncCall),
    fork(watchCopyRawToEdited),
    fork(watchAddNewProject),
    fork(watchAddAndPopulateChannel),
    fork(watchAddEmptyChannel),
    fork(watchDeleteSupportingChannel),
  ]);
}