import * as _ from 'lodash';
import { Action, combineActions, handleActions } from 'redux-actions';
import { projectsScreenActionTypes } from './action-creators';
import { IProject, IProjectsScreenState } from './state';
import { ISite, IChannel, ISitesChannels } from '../model';

const initialState = {
  projects: [],
  sites: [],
  channels: [],
  showModal: false,
} as IProjectsScreenState;

export default handleActions<IProjectsScreenState, IProject[] | IProject | ISite[] | IChannel[] | ISitesChannels>({
  [projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED]: (state: IProjectsScreenState, action: Action<IProject[]>) => {
    return _.extend({}, state, { projects: action.payload } as IProjectsScreenState);
  },
  [projectsScreenActionTypes.ADD_PROJECT_FULFILED]: (state: IProjectsScreenState, action: Action<IProject>) => {
    return _.extend({}, state, {
      projects: _.concat(state.projects, action.payload),
      showModal: false,
    } as IProjectsScreenState);
  },
  [projectsScreenActionTypes.GET_SITES_FOR_PROJECT_FULFILED]: (state: IProjectsScreenState, action: Action<ISite[]>) => {
    return {
      ...state,
      sites: action.payload,
    } as IProjectsScreenState;
  },
  [projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_FULFILED]: (state: IProjectsScreenState, action: Action<IChannel[]>) => {
    return {
      ...state,
      channels: action.payload,
    } as IProjectsScreenState;
  },
  [projectsScreenActionTypes.SHOW_ADD_PROJECT_FULFILED]: (state: IProjectsScreenState, action: Action<ISitesChannels>) => {
    return {
      ...state,
      showModal: true,
      sites: action.payload.sites,
      channels: action.payload.channels,
    };
  },
  [projectsScreenActionTypes.CANCEL_SHOW_ADD_PROJECT]: (state: IProjectsScreenState) => {
    return {
      ...state,
      showModal: false,
    };
  },
}, initialState);