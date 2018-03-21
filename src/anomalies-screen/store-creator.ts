import { Action, handleActions } from 'redux-actions'
import * as _ from 'lodash'
import { IAnomaliesScreenState } from './state'
import { anomaliesScreenActionTypes } from './action-creators'


const initialState = <IAnomaliesScreenState>{
  anotherDummyText: "heloo oooo ooo ooo ooo"
}

export default handleActions<IAnomaliesScreenState, string>({
  [anomaliesScreenActionTypes.ANOMALY_TEST_ACTION]: (state: IAnomaliesScreenState, action: Action<string>) => {
    return _.extend({}, state, <IAnomaliesScreenState>{ anotherDummyText: action.payload })
  }
}, initialState)
