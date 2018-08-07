import * as _ from 'lodash';
import * as ReactGA from 'react-ga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { Action } from 'redux';
import { takeEvery, select } from 'redux-saga/effects';
import { handleErrorInSaga } from '@common/handle-error-in-saga';
import { environments } from '@common/environments';
import { IState } from '../state';
import { CONFIGURATION_LOAD_SUCCEEDED } from '@business-logic/configuration/action-types';

function* initializationCallback(action: Action) {
  try {
    const gaTrackingNumber = yield select((state: IState) => state.configuration.gaTrackingNumber);
    if (_.isString(gaTrackingNumber)) {
      ReactGA.initialize(gaTrackingNumber);
      ReactGA.pageview(window.location.hash);
    }
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

function* locationChangedCallback(action: Action) {
  console.log('action', action);
  try {
    const gaTrackingNumber = yield select((state: IState) => state.configuration.gaTrackingNumber);
    if (_.isString(gaTrackingNumber)) {
      ReactGA.pageview(window.location.hash);
    }
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}
export function* watchRouterForGoogleAnalitycs() {
  if (process.env.NODE_ENV === environments.PRODUCTION) {
    yield takeEvery(CONFIGURATION_LOAD_SUCCEEDED, initializationCallback);
    yield takeEvery(LOCATION_CHANGE, locationChangedCallback);
  }
}