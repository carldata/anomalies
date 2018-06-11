import { Action } from 'redux';
import * as actionTypes from './action-types';
import { IProject } from '../models/project';

// tslint:disable:max-classes-per-file
class AddProjectStartAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_START;
  constructor(public payload: IProject) { }
}

class AddProjectFulfiledAction implements Action {
  public readonly type = actionTypes.ADD_PROJECT_FULFILED;
  constructor(public payload: IProject) { }
}

class GetAllProjectsAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START;
}

class GetAllProjectsFullfilledAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED;
  constructor(public payload: IProject[]) { }
}

class GetAllProjectsRejectedAction implements Action {
  public readonly type = actionTypes.GET_ALL_PROJECTS_ASYNC_CALL_REJECTED;
}

export {
  AddProjectStartAction,
  AddProjectFulfiledAction,
  GetAllProjectsAction,
  GetAllProjectsFullfilledAction,
  GetAllProjectsRejectedAction,
};