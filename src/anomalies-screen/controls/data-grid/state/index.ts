export interface IDataGridState {
  rows: IDataGridRow[];
}

export interface IDataGridRow {
  date: any;
  epoch: any;
  rawValue: any;
  editedValue: any;
  fixedValue: any;
  extendedValue1?: any;
  extendedValue2?: any;
  extendedValue3?: any;
  extendedValue4?: any;
  extendedValue5?: any;
}