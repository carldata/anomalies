import * as _ from 'lodash';
import { HideModalAction } from './actions';

type IHideModalActionCreator = () => HideModalAction;

const hideModal: IHideModalActionCreator = () =>
  _.toPlainObject(new HideModalAction());

export {
  hideModal,
  IHideModalActionCreator,
};