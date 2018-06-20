import { HideGeneralMessageModalAction } from './actions';

export interface IModalState {
  header: string;
  title: string;
  show: boolean;
  allowClose: boolean;
  hideModal: HideGeneralMessageModalAction;
}