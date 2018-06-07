import { Action } from 'redux';
import * as actionTypes from './action-types';

// tslint:disable:max-classes-per-file
class ShowModalAction implements Action {
  public readonly type = actionTypes.SHOW_MODAL;
  constructor(public header: string = 'loading', public title: string = 'please wait', public allowClose: boolean = false) { }
}

class HideModalAction implements Action {
  public readonly type = actionTypes.HIDE_MODAL;
}

export {
  ShowModalAction,
  HideModalAction,
};