import * as _ from 'lodash';
import * as actionTypes from './action-types';
import {
  GetAllProjectsFulfilledAction,
  AddProjectFulfilledAction,
  GetSitesForProjectFulfilledAction,
  GetChannelsForSiteFulfilledAction,
  ShowAddProjectFulfilledAction,
  CancelShowAddProjectAction,
} from './actions';
import { IProjectsScreenState } from './models/projects-screen-state';
import { IChannel } from '../model';

const initialState: IProjectsScreenState = {
  channels: [],
  projects: [],
  showModal: false,
  sites: [],
} as IProjectsScreenState;

export type MainScreenActionsTypes = GetAllProjectsFulfilledAction|
                                     AddProjectFulfilledAction|
                                     GetSitesForProjectFulfilledAction|
                                     GetChannelsForSiteFulfilledAction|
                                     ShowAddProjectFulfilledAction|
                                     CancelShowAddProjectAction;

export const projectsScreenReducer = (state: IProjectsScreenState = initialState, action: MainScreenActionsTypes): IProjectsScreenState => {
  switch (action.type) {
    case actionTypes.GET_ALL_PROJECTS_FULFILLED:
      return { ...state, projects: action.payload };
    case actionTypes.ADD_PROJECT_FULFILLED:
      return { ...state, projects: _.concat(state.projects, action.payload), showModal: false };
    case actionTypes.GET_SITES_FOR_PROJECT_FULFILLED:
      return { ...state, sites: action.payload };
    case actionTypes.GET_CHANNELS_FOR_SITE_FULFILLED:
      return { ...state, channels: action.payload };
    case actionTypes.SHOW_ADD_PROJECT_FULFILLED:
      return { ...state, showModal: true, sites: action.payload.sites, channels: action.payload.channels };
    case actionTypes.CANCEL_SHOW_ADD_PROJECT:
      return { ...state, showModal: false };
    default:
      return state;
  }
};