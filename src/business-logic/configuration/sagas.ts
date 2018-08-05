import axios from 'axios';
import * as _ from 'lodash';
import { push } from 'react-router-redux';
import { put, take, takeEvery, select } from 'redux-saga/effects';
import {
  ConfigurationLoadSucceededAction,
  SetTokenStartedAction,
  SetTokenSucceededAction,
} from '@business-logic/configuration/actions';
import {
  CONFIGURATION_LOAD_STARTED,
  CONFIGURATION_LOAD_SUCCEEDED,
  SET_TOKEN_STARTED,
} from '@business-logic/configuration/action-types';
import { IState } from '../../state';
import { getCookie, setCookie } from '@common/cookie-auxiliary';

export function* getConfigurationSaga() {
  yield take(CONFIGURATION_LOAD_STARTED);
  try {
    const localResponse = yield axios.get('configuration.json');
    const token = getCookie('fw_jwt');
    if (_.isObject(localResponse)) {
      localResponse.data.token = token;
      console.log('localResponse.data', localResponse.data);
      yield put(_.toPlainObject(new ConfigurationLoadSucceededAction(localResponse.data)));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* watchSetTokenSaga() {
  yield takeEvery(SET_TOKEN_STARTED, function* (action: SetTokenStartedAction) {
    try {
      const configurationLoaded: boolean = yield select((state: IState) => state.configuration.loaded);
      if (!configurationLoaded) {
        yield take(CONFIGURATION_LOAD_SUCCEEDED);
      }
      setCookie('fw_jwt', action.token, 120);
      yield put(_.toPlainObject(new SetTokenSucceededAction(action.token)));
      yield put(push('/projects'));
    } catch (error) {
      console.log(error);
    }
  });
}