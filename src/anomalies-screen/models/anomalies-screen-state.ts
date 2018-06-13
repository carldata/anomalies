import { IHpTimeSeriesChartState, IUnixTimePoint } from 'time-series-scroller';
import { IProject, ISite, IChannel } from '@models/.';
import { IDataGridState } from '../controls/data-grid/state';
import { ISupportingChannel } from '../models/supporting-channel';

export interface IAnomaliesScreenState {
  rawSeries: IUnixTimePoint[];
  fixedAnomaliesSeries: IUnixTimePoint[];
  editedChannelSeries: IUnixTimePoint[];
  supportingChannels: ISupportingChannel[];
  project: IProject;
  lastStartDate: string;
  lastEndDate: string;
  showModal: boolean;
  sites: ISite[];
  channels: IChannel[];
  mainChartEmpty: boolean;
}