import { Action } from 'redux';
import * as actionTypes from './action-types';

// tslint:disable:max-classes-per-file
class ShowGeneralMessageModalAction implements Action {
  public readonly type = actionTypes.SHOW_GENERAL_MESSAGE_MODAL;
  constructor(public header: string = 'loading', public title: string = 'please wait', public allowClose: boolean = false) { }
}

class HideGeneralMessageModalAction implements Action {
  public readonly type = actionTypes.HIDE_GENERAL_MESSAGE_MODAL;
}

export {
  ShowGeneralMessageModalAction,
  HideGeneralMessageModalAction,
};