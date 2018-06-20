import * as _ from 'lodash';
import { HideGeneralMessageModalAction } from './actions';

type IHideModalActionCreator = () => HideGeneralMessageModalAction;

const hideModal: IHideModalActionCreator = () =>
  _.toPlainObject(new HideGeneralMessageModalAction());

export {
  hideModal,
  IHideModalActionCreator,
};