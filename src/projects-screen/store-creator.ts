import * as _ from 'lodash';
import { Action, combineActions, handleActions } from 'redux-actions';
import { projectsScreenActionTypes } from './action-creators';
import { IProject, IProjectsScreenState } from './state';

const initialState = {
  projects: [],
} as IProjectsScreenState;

export default handleActions<IProjectsScreenState, IProject[] | IProject>({
  [projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED]: (state: IProjectsScreenState, action: Action<IProject[]>) => {
    return _.extend({}, state, { projects: action.payload } as IProjectsScreenState);
  },
  [projectsScreenActionTypes.ADD_PROJECT_FULFILED]: (state: IProjectsScreenState, action: Action<IProject>) => {
    return _.extend({}, state, {
      projects: _.concat(state.projects, action.payload)
    } as IProjectsScreenState);
  },
}, initialState);