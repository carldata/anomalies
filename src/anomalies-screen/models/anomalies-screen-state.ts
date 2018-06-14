import { IHpTimeSeriesChartState, IUnixTimePoint } from 'time-series-scroller';
import { IProject, ISite, IChannel } from '@models/.';
import { IDataGridState } from '../controls/data-grid/state';
import { IAnomaliesTimeSeries } from './anomalies-time-series';

export interface IAnomaliesScreenState {
  project: IProject;
  showAddSupportingChannelModal: boolean;
  timeSeries: IAnomaliesTimeSeries;
  sites: ISite[];
  channels: IChannel[];
  mainChartEmpty: boolean;
}