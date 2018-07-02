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
  watchShowProjectDefinitionModalToAdd,
  watchShowProjectDefinitionModalToEdit,
  watchHideProjectDefinitionModal,
  watchDeleteProject,
} from './projects-screen/sagas';
import { initializationSaga } from '@business-logic/configuration/initialization';
// import { watchEditProject } from './projects-screen/sagas/edit-project';

export function* rootSaga() {
  return yield all([
    fork(initializationSaga),
    fork(watchGoToAnomalies),
    // fork(watchEditProject),
    fork(watchDeleteProject),
    fork(watchGoToProjects),
    fork(watchGetTimeSeries),
    fork(watchGetAllProjectsAsyncCall),
    fork(watchAddNewProject),
    fork(watchAddAndPopulateChannel),
    fork(watchSaveProject),
    fork(watchGetSitesForProject),
    fork(watchGetChannelsForSite),
    fork(watchShowProjectDefinitionModalToAdd),
    fork(watchShowProjectDefinitionModalToEdit),
    fork(watchHideProjectDefinitionModal),
    fork(watchShowDefineChannelModal),
    fork(watchGetChannelsForSiteAnomalies),
  ]);
}