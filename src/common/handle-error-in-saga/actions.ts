import { Action } from 'redux';
import { BACKEND_ERROR } from './action-types';

export class BackendOperationErrorAction implements Action {
  public readonly type = BACKEND_ERROR;
  constructor(public error: any) { }
}