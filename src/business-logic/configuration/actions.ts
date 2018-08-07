import { Action } from 'redux';
import * as actionTypes from './action-types';
import { IConfigurationState } from '@business-logic/configuration/models/state';

// tslint:disable:max-classes-per-file

class ConfigurationLoadStartedAction implements Action {
  public readonly type = actionTypes.CONFIGURATION_LOAD_STARTED;
}

class ConfigurationLoadSucceededAction implements Action {
  public readonly type = actionTypes.CONFIGURATION_LOAD_SUCCEEDED;
  constructor(public configuration: IConfigurationState) { }
}

export {
  ConfigurationLoadStartedAction,
  ConfigurationLoadSucceededAction,
};
