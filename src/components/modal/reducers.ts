import * as actionTypes from './action-types';
import { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from './actions';
import { IGeneralMessageModalState } from './model';

const initialState: IGeneralMessageModalState = { show: false } as IGeneralMessageModalState;

export type GeneralMessageModalActionsTypes = ShowGeneralMessageModalAction|HideGeneralMessageModalAction;

export const generalMessageModalContainerReducer = (state: IGeneralMessageModalState = initialState, action: GeneralMessageModalActionsTypes): IGeneralMessageModalState => {
  switch (action.type) {
    case actionTypes.SHOW_GENERAL_MESSAGE_MODAL:
      return { title: action.title, header: action.header, show: true, allowClose: action.allowClose } as IGeneralMessageModalState;
    case actionTypes.HIDE_GENERAL_MESSAGE_MODAL:
      return { title: '', header: '', show: false } as IGeneralMessageModalState;
    default:
      return state;
  }
};