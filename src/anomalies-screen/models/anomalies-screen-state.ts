import { IHpTimeSeriesChartState, IUnixTimePoint } from 'time-series-scroller';
import { IProject, ISite, IChannel } from '@models/.';
import { IDataGridState } from '../controls/data-grid/state';
import { IAnomaliesTimeSeries } from './anomalies-time-series';
import { ITimeSeriesLoadContext } from './time-series-load-context';

export interface IAnomaliesScreenState {
  project: IProject;
  sites: ISite[];
  channels: IChannel[];
  supportingChannelModalShown: boolean;
  timeSeriesLoadContext: ITimeSeriesLoadContext;
  timeSeries: IAnomaliesTimeSeries;
}