import * as React from 'react';
import { connect } from 'react-redux';
import ResponsiveModal from 'react-responsive-modal';
import { bindActionCreators, Dispatch } from 'redux';
import { hideModal, IHideModalActionCreator } from './action-creators';
import { IModalState } from './model';
import { IState } from '../../state';

interface IDispatchProps {
  hideModal: IHideModalActionCreator;
}

const Modal = (props: IModalState & IDispatchProps) =>
  <span id={`modal-${props.show ? 'visible' : 'hidden'}`}>
    <ResponsiveModal
      center
      open={props.show}
      showCloseIcon={props.allowClose}
      onClose={() => props.hideModal() }>
      <h2>{props.header}</h2>
      <p>{props.title}</p>
    </ResponsiveModal>
  </span>;

const mapStateToProps = (state: IState): IModalState => {
  return state.modalState;
};

const mapDispatchToProps = (dispatch: Dispatch<void>) => {
  return bindActionCreators({
    hideModal,
  }, dispatch);
};


export const ModalContainer = connect<IModalState, {}, {}>(mapStateToProps, mapDispatchToProps)(Modal);

export { ShowModalAction, HideModalAction } from './actions';
export { IModalState } from './model';
export { ModalActionsTypes, modalContainerReducer } from './reducers';

