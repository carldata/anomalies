import {IHpTimeSeriesChartState} from 'time-series-scroller';
import { IDataGridState } from '../controls/data-grid/state';

export interface IAnomaliesScreenState {
  chartState: IHpTimeSeriesChartState;
  gridState: IDataGridState;
}