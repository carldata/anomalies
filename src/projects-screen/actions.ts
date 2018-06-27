import { Action } from 'redux';
import * as actionTypes from './action-types';
import { IProject, ISite, IChannel } from '../models';

// tslint:disable:max-classes-per-file
export class AddProjectStartedAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_STARTED;
  constructor(public payload: IProject) { }
}

export class AddProjectFetchingAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_FETCHING;
}

export class AddProjectFulfilledAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_FULFILLED;
  constructor(public payload: IProject) { }
}

export class GetAllProjectsStartedAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_STARTED;
}

export class GetAllProjectsFulfilledAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_FULFILLED;
  constructor(public payload: IProject[]) { }
}

export class GoToAnomaliesScreenAction implements Action {
  public readonly type = actionTypes.GO_TO_ANOMALIES;
  constructor(public payload: IProject) { }
}

export class ShowProjectDefinitionModalAction implements Action {
  public readonly type = actionTypes.SHOW_PROJECT_DEFINITION_MODAL;
}

export class HideProjectDefinitionModalAction implements Action {
  public readonly type = actionTypes.HIDE_PROJECT_DEFINITION_MODAL;
  constructor(public payload: { project: IProject, approved: boolean }) { }
}

export class GetSitesForProjectStartedAction implements Action {
  public readonly type = actionTypes.GET_SITES_FOR_PROJECT_STARTED;
  constructor(public payload: string) { }
}

export class GetSitesForProjectFetchingAction implements Action {
  public readonly type = actionTypes.GET_SITES_FOR_PROJECT_FETCHING;
}

export class GetSitesForProjectFulfilledAction implements Action {
  public readonly type = actionTypes.GET_SITES_FOR_PROJECT_FULFILLED;
  constructor(public payload: ISite[]) { }
}

export class GetChannelsForSiteStartedAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_STARTED;
  constructor(public payload: string) { }
}

export class GetChannelsForSiteFetchingAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_FETCHING;
}

export class GetChannelsForSiteFulfilledAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_FULFILLED;
  constructor(public payload: IChannel[]) { }
}

export class DeleteProjectStartedAction implements Action {
  public readonly type = actionTypes.DELETE_PROJECT_STARTED;
  constructor(public payload: string) { }
}

export class DeleteProjectDeletingAction implements Action {
  public readonly type = actionTypes.DELETE_PROJECT_DELETING;
  constructor(public payload: string) { }
}

export class DeleteProjectFulfilledAction implements Action {
  public readonly type = actionTypes.DELETE_PROJECT_FULFILLED;
  constructor(public payload: string) { }
}