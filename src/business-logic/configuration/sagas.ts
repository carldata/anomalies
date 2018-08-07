import axios from 'axios';
import * as _ from 'lodash';
import { push } from 'react-router-redux';
import { put, take, takeEvery, select } from 'redux-saga/effects';
import {
  ConfigurationLoadSucceededAction,
} from '@business-logic/configuration/actions';
import {
  CONFIGURATION_LOAD_STARTED,
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