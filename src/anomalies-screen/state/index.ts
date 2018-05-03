import {IHpTimeSeriesChartState} from 'time-series-scroller';
import { IDataGridState } from '../controls/data-grid/state';
import { IProject } from '../../projects-screen/state';

export interface IAnomaliesScreenState {
  mainChartState: IHpTimeSeriesChartState;
  gridState: IDataGridState;
  project: IProject;
}