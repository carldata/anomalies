import * as _ from 'lodash';
import { Action, combineActions, handleActions } from 'redux-actions';
import { projectsScreenActionTypes } from './action-creators';
import { IProjectsScreenState } from './state';

const initialState = {
  dummyText: 'initital text',
} as IProjectsScreenState;

export default handleActions<IProjectsScreenState, string>({
  [combineActions(projectsScreenActionTypes.TEST_ACTION,
    projectsScreenActionTypes.TEST_ASYNC_CALL_FULFILED,
    projectsScreenActionTypes.TEST_ASYNC_CALL_REJECTED)]: (state: IProjectsScreenState, action: Action<string>) => {
      return _.extend({}, state, { dummyText: action.payload } as IProjectsScreenState);
    },
}, initialState);