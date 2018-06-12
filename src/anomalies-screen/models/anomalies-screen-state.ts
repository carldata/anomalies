import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IProject, ISite, IChannel } from '@models/.';
import { IDataGridState } from '../controls/data-grid/state';
import { ISupportingChannel } from '../models/supporting-channel';

export interface IAnomaliesScreenState {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: ISupportingChannel[];
  gridState: IDataGridState;
  project: IProject;
  lastStartDate: string;
  lastEndDate: string;
  showModal: boolean;
  sites: ISite[];
  channels: IChannel[];
  mainChartEmpty: boolean;
}