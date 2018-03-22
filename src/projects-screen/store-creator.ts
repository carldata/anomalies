import * as _ from 'lodash';
import { Action, combineActions, handleActions } from 'redux-actions';
import { projectsScreenActionTypes } from './action-creators';
import { IProject, IProjectsScreenState } from './state';

const mockProjectsScreen = [
  {
    endDate: '2018-01-01T00:00:00',
    id: 'project id 1',
    name: 'project name 1',
    splitDate: '2018-02-01T00:00:00',
    startDate: '2018-02-01T00:00:00',
  } as IProject,
  {
    endDate: '2018-01-01T00:00:00',
    id: 'project id 2',
    name: 'project name 2',
    splitDate: '2018-02-01T00:00:00',
    startDate: '2018-02-01T00:00:00',
  } as IProject,
  {
    endDate: '2018-01-01T00:00:00',
    id: 'project id 3',
    name: 'project name 3',
    splitDate: '2018-02-01T00:00:00',
    startDate: '2018-02-01T00:00:00',
  } as IProject,
];

const initialState = {
  dummyText: 'initital text',
  projects: mockProjectsScreen,
} as IProjectsScreenState;

export default handleActions<IProjectsScreenState, string>({
  [combineActions(projectsScreenActionTypes.TEST_ACTION,
    projectsScreenActionTypes.TEST_ASYNC_CALL_FULFILED,
    projectsScreenActionTypes.TEST_ASYNC_CALL_REJECTED)]: (state: IProjectsScreenState, action: Action<string>) => {
      return _.extend({}, state, { dummyText: action.payload } as IProjectsScreenState);
    },
}, initialState);