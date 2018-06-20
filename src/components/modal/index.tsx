import * as React from 'react';
import { connect } from 'react-redux';
import ResponsiveModal from 'react-responsive-modal';
import { bindActionCreators, Dispatch } from 'redux';
import { hideGeneralMessageModal, IHideGeneralMessageModalActionCreator } from './action-creators';
import { IGeneralMessageModalState } from './model';
import { IState } from '../../state';

interface IDispatchProps {
  hideGeneralMessageModal: IHideGeneralMessageModalActionCreator;
}

const Modal = (props: IGeneralMessageModalState & IDispatchProps) =>
  <span id={`modal-${props.show ? 'visible' : 'hidden'}`}>
    <ResponsiveModal
      center
      open={props.show}
      showCloseIcon={props.allowClose}
      onClose={() => props.hideGeneralMessageModal()}>
      <h2>{props.header}</h2>
      <p>{props.title}</p>
    </ResponsiveModal>
  </span>;

const mapStateToProps = (state: IState): IGeneralMessageModalState => {
  return state.modalState;
};

const mapDispatchToProps = (dispatch: Dispatch<void>) => {
  return bindActionCreators({
    hideGeneralMessageModal,
  }, dispatch);
};


export const GeneralMessageModalContainer = connect<IGeneralMessageModalState, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Modal);

export { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from './actions';
export { IGeneralMessageModalState } from './model';
export { GeneralMessageModalActionsTypes, generalMessageModalContainerReducer } from './reducers';

