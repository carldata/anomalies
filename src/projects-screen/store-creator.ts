import { IProjectsScreenState } from './state'
import { Action, combineActions, handleActions } from 'redux-actions'
import { projectsScreenActionTypes } from './action-creators'
import * as _ from 'lodash'

const initialState = <IProjectsScreenState>{
  dummyText: 'initital text'
}

export default handleActions<IProjectsScreenState, string>({
  [combineActions(projectsScreenActionTypes.TEST_ACTION,
    projectsScreenActionTypes.TEST_ASYNC_CALL_FULFILED,
    projectsScreenActionTypes.TEST_ASYNC_CALL_REJECTED)]: (state: IProjectsScreenState, action: Action<string>) => {
      return _.extend({}, state, <IProjectsScreenState>{ dummyText: action.payload })
    },
}, initialState)