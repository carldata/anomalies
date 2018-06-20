import * as React from 'react';
import { connect } from 'react-redux';
import ResponsiveModal from 'react-responsive-modal';
import { bindActionCreators, Dispatch } from 'redux';
import { hideGeneralMessageModal, IHideGeneralMessageModalActionCreator } from './action-creators';
import { IModalState } from './model';
import { IState } from '../../state';

interface IDispatchProps {
  hideGeneralMessageModal: IHideGeneralMessageModalActionCreator;
}

const Modal = (props: IModalState & IDispatchProps) =>
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

const mapStateToProps = (state: IState): IModalState => {
  return state.modalState;
};

const mapDispatchToProps = (dispatch: Dispatch<void>) => {
  return bindActionCreators({
    hideGeneralMessageModal,
  }, dispatch);
};


export const ModalContainer = connect<IModalState, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Modal);

export { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from './actions';
export { IModalState } from './model';
export { ModalActionsTypes, modalContainerReducer } from './reducers';

