import * as _ from 'lodash';
import { HideGeneralMessageModalAction } from './actions';

type IHideGeneralMessageModalActionCreator = () => HideGeneralMessageModalAction;

const hideGeneralMessageModal: IHideGeneralMessageModalActionCreator = () =>
  _.toPlainObject(new HideGeneralMessageModalAction());

export {
  hideGeneralMessageModal,
  IHideGeneralMessageModalActionCreator,
};