import * as _ from 'lodash';
import * as actionTypes from './action-types';
import {
  GetAllProjectsFulfilledAction,
  AddProjectFulfilledAction,
  GetSitesForProjectFulfilledAction,
  GetChannelsForSiteFulfilledAction,
  ShowProjectDefinitionModalAction,
  HideProjectDefinitionModalAction,
  DeleteProjectFulfilledAction,
  EditProjectFulfilledAction,
} from './actions';
import { IProjectsScreenState } from './models/projects-screen-state';

const initialState: IProjectsScreenState = {
  channels: [],
  projects: [],
  showModal: false,
  sites: [],
} as IProjectsScreenState;

export type MainScreenActionsTypes = GetAllProjectsFulfilledAction |
  AddProjectFulfilledAction |
  GetSitesForProjectFulfilledAction |
  GetChannelsForSiteFulfilledAction |
  ShowProjectDefinitionModalAction |
  HideProjectDefinitionModalAction |
  DeleteProjectFulfilledAction |
  EditProjectFulfilledAction;

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
    case actionTypes.SHOW_PROJECT_DEFINITION_MODAL:
      return { ...state, showModal: true };
    case actionTypes.HIDE_PROJECT_DEFINITION_MODAL:
      return { ...state, showModal: false };
    case actionTypes.DELETE_PROJECT_FULFILLED:
      return { ...state, projects: _.filter(state.projects, (proj) => proj.id !== action.payload) };
    case actionTypes.EDIT_PROJECT_FULFILLED:
      return { ...state };
    default:
      return state;
  }
};