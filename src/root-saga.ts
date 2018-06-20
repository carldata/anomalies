import { all, fork } from 'redux-saga/effects';
import {
  watchSaveProject,
  watchAddAndPopulateChannel,
  watchGetTimeSeries,
  watchGoToProjects,
  watchShowDefineChannelModal,
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
    fork(watchAddNewProject),
    fork(watchAddAndPopulateChannel),
    fork(watchSaveProject),
    fork(watchGetSitesForProject),
    fork(watchGetChannelsForSite),
    fork(watchShowProjectDefinitionModal),
    fork(watchHideProjectDefinitionModal),
    fork(watchShowDefineChannelModal),
    fork(watchGetChannelsForSiteAnomalies),
  ]);
}