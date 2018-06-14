import { IUnixTimePoint } from 'time-series-scroller';

export type ITimeSeries = IUnixTimePoint[];

export interface IAnomaliesTimeSeries {
  rawSeries: ITimeSeries;
  fixedAnomaliesSeries: ITimeSeries;
  editedChannelSeries: ITimeSeries;
  supportingChannels: ITimeSeries[];
}