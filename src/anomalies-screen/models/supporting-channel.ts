import { IHpTimeSeriesChartState } from 'time-series-scroller';

export interface ISupportingChannel {
  site: string;
  channel: string;
  chartState: IHpTimeSeriesChartState;
}