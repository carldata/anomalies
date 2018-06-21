import { IDataGridRow } from '../controls/data-grid/state';

export interface IDeleteSupportingChannelPayload {
  idx: number;
  rows: IDataGridRow[];
}