import axios from 'axios';
import * as _ from 'lodash';
import { put } from 'redux-saga/effects';
import { ConfigurationLoadStartedAction, ConfigurationLoadSucceededAction } from '@business-logic/configuration/actions';

export function* getConfigurationSaga() {
    yield put(_.toPlainObject(new ConfigurationLoadStartedAction()));
    try {
        const localResponse = yield axios.get('configuration.json');
        if (_.isObject(localResponse)) {
            yield put(_.toPlainObject(new ConfigurationLoadSucceededAction(localResponse.data)));
        }
    } catch (error) {
        //
    }
}