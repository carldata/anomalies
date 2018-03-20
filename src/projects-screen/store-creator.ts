import { IProjectsScreenState } from './state'
import { Action, handleActions } from 'redux-actions'
import { projectsScreenActionTypes } from './action-creators'
import * as _ from 'lodash'

const initialState = <IProjectsScreenState>{
  dummyText: 'initital text'
}

export default handleActions<IProjectsScreenState, string>({
  [projectsScreenActionTypes.TEST_ACTION]: (state: IProjectsScreenState, action: Action<string>) => {
    return _.extend({}, state, <IProjectsScreenState>{ dummyText: action.payload })
  }
}, initialState)