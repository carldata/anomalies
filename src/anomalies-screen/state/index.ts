import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState } from '../controls/data-grid/state';
import { IProject } from '../../projects-screen/state';
import { ISite, IChannel } from '../../model';
import { channel } from 'redux-saga';

export interface IAnomaliesScreenState {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: { site: string, channel: string, chartState: IHpTimeSeriesChartState }[];
  gridState: IDataGridState;
  project: IProject;
  lastStartDate: string;
  lastEndDate: string;
  showModal: boolean;
  sites: ISite[];
  channels: IChannel[];
  mainChartEmpty: boolean;
}