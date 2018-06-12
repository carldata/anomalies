import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState } from '../controls/data-grid/state';
import { IProject, IChannel, ISite } from '../../models';

export interface IAnomaliesScreenState {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: Array<{ site: string, channel: string, chartState: IHpTimeSeriesChartState }>;
  gridState: IDataGridState;
  project: IProject;
  lastStartDate: string;
  lastEndDate: string;
  showModal: boolean;
  sites: ISite[];
  channels: IChannel[];
  mainChartEmpty: boolean;
}