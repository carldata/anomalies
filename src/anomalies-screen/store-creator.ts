import * as _ from 'lodash';
import { Action, handleActions } from 'redux-actions';
import { anomaliesScreenActionTypes } from './action-creators';
import { IAnomaliesScreenState } from './state';


const initialState = {
  anotherDummyText: 'heloo oooo ooo ooo ooo',
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, string>({
  [anomaliesScreenActionTypes.ANOMALY_TEST_ACTION]: (state: IAnomaliesScreenState, action: Action<string>) => {
    return _.extend({}, state, { anotherDummyText: action.payload } as IAnomaliesScreenState);
  },
}, initialState);
