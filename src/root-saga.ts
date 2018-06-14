import { all, fork } from 'redux-saga/effects';
import {
  watchSaveProject,
  watchDeleteSupportingChannel,
  watchAddEmptyChannel,
  watchAddAndPopulateChannel,
  watchGetTimeSeries,
  watchGoToProjects,
  watchCopyRawToEdited,
  watchShowAddNewChannel,
  watchGetChannelsForSiteAnomalies,
} from './anomalies-screen/sagas';
import {
  watchGoToAnomalies,
  watchGetAllProjectsAsyncCall,
  watchAddNewProject,
  watchGetSitesForProject,
  watchGetChannelsForSite,
  watchShowProjectDefinitionModal,
  watchHideProjectDefinitionModal,
} from './projects-screen/sagas';

export function* rootSaga() {
  return yield all([
    fork(watchGoToAnomalies),
    fork(watchGoToProjects),
    fork(watchGetTimeSeries),
    fork(watchGetAllProjectsAsyncCall),
    fork(watchCopyRawToEdited),
    fork(watchAddNewProject),
    fork(watchAddAndPopulateChannel),
    fork(watchAddEmptyChannel),
    fork(watchDeleteSupportingChannel),
    fork(watchSaveProject),
    fork(watchGetSitesForProject),
    fork(watchGetChannelsForSite),
    fork(watchShowProjectDefinitionModal),
    fork(watchHideProjectDefinitionModal),
    fork(watchShowAddNewChannel),
    fork(watchGetChannelsForSiteAnomalies),
  ]);
}