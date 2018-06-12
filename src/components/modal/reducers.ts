import * as actionTypes from './action-types';
import { ShowModalAction, HideModalAction } from './actions';
import { IModalState } from './model';

const initialState: IModalState = { show: false } as IModalState;

export type ModalActionsTypes = ShowModalAction|HideModalAction;

export const modalContainerReducer = (state: IModalState = initialState, action: ModalActionsTypes): IModalState => {
  switch (action.type) {
    case actionTypes.SHOW_MODAL:
      return { title: action.title, header: action.header, show: true, allowClose: action.allowClose } as IModalState;
    case actionTypes.HIDE_MODAL:
      return { title: '', header: '', show: false } as IModalState;
    default:
      return state;
  }
};