import * as _ from 'lodash';
import { Action, combineActions, handleActions } from 'redux-actions';
import { projectsScreenActionTypes } from './action-creators';
import { IProject, IProjectsScreenState } from './state';

const initialState = {

} as IProjectsScreenState;

export default handleActions<IProjectsScreenState, string | IProject[] >({
  [projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED]: (state: IProjectsScreenState, action: Action<IProject[]>) => {
    return _.extend({}, state, { projects: action.payload } as IProjectsScreenState);
  },

}, initialState);