import { Action } from 'redux';
import * as actionTypes from './action-types';
import { IProject } from './models/project';
import { IChannel, ISite, ISitesChannels } from '../model';

// tslint:disable:max-classes-per-file
class AddProjectStartedAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_STARTED;
  constructor(public payload: IProject) { }
}

class AddProjectFetchingAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_FETCHING;
}

class AddProjectFulfilledAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_FULFILLED;
  constructor(public payload: IProject) { }
}

class AddProjectRejectedAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_REJECTED;
}

class GetAllProjectsStartedAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_STARTED;
}

class GetAllProjectsFulfilledAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_FULFILLED;
  constructor(public payload: IProject[]) { }
}

class GetAllProjectsRejectedAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_REJECTED;
}

class GoToAnomaliesScreenAction implements Action {
  public readonly type = actionTypes.GO_TO_ANOMALIES;
  constructor(public payload: IProject) { }
}

class ShowProjectDefinitionModalAction implements Action {
  public readonly type = actionTypes.SHOW_PROJECT_DEFINITION_MODAL;
}

class HideProjectDefinitionModalAction implements Action {
  public readonly type = actionTypes.HIDE_PROJECT_DEFINITION_MODAL;
  constructor(public payload: { project: IProject, approved: boolean }) { }
}

class GetSitesForProjectStartedAction implements Action {
  public readonly type = actionTypes.GET_SITES_FOR_PROJECT_STARTED;
  constructor(public payload: string) { }
}

class GetSitesForProjectFetchingAction implements Action {
  public readonly type = actionTypes.GET_SITES_FOR_PROJECT_FETCHING;
}

class GetSitesForProjectFulfilledAction implements Action {
  public readonly type = actionTypes.GET_SITES_FOR_PROJECT_FULFILLED;
  constructor(public payload: ISite[]) { }
}

class GetSitesForProjectRejectedAction implements Action {
  public readonly type = actionTypes.GET_SITES_FOR_PROJECT_REJECTED;
}

class GetChannelsForSiteStartedAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_STARTED;
  constructor(public payload: string) { }
}

class GetChannelsForSiteFetchingAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_FETCHING;
}

class GetChannelsForSiteFulfilledAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_FULFILLED;
  constructor(public payload: IChannel[]) { }
}

class GetChannelsForSiteRejectedAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_REJECTED;
}

export {
  AddProjectStartedAction,
  AddProjectFetchingAction,
  AddProjectFulfilledAction,
  AddProjectRejectedAction,
  GetAllProjectsStartedAction,
  GetAllProjectsFulfilledAction,
  GetAllProjectsRejectedAction,
  GoToAnomaliesScreenAction,
  ShowProjectDefinitionModalAction,
  HideProjectDefinitionModalAction,
  GetSitesForProjectStartedAction,
  GetSitesForProjectFetchingAction,
  GetSitesForProjectFulfilledAction,
  GetSitesForProjectRejectedAction,
  GetChannelsForSiteStartedAction,
  GetChannelsForSiteFetchingAction,
  GetChannelsForSiteFulfilledAction,
  GetChannelsForSiteRejectedAction,
};