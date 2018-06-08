import { channel } from 'redux-saga';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState } from '../controls/data-grid/state';
import { ISite, IChannel } from '../../model';
import { IProject } from '../../projects-screen/models/project';

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