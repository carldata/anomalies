import { IHpTimeSeriesChartState, IUnixTimePoint } from 'time-series-scroller';

export interface ISupportingChannel {
  site: string;
  channel: string;
  timeSeries: IUnixTimePoint[];
}