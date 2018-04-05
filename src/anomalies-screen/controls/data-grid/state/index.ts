export interface IDataGridState
{
    series: IDataGridRow[]
}

export interface IDataGridRow
{
    date: any;
    rawValue: any;
    editedValue: any;
    anomalyValue: any;
}