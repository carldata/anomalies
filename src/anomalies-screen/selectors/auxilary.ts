import * as _ from 'lodash';
import { IUnixTimePoint } from 'time-series-scroller';
import { ITimeSeries } from '../models/anomalies-time-series';

export const createAnomaliesTimeSeriesForScrollbar = (rawSeries: ITimeSeries, fixedAnomaliesSeries: ITimeSeries): ITimeSeries => {
  const fixedAnomaliesSeriesMap: Map<number, number> = _.reduce<IUnixTimePoint[], Map<number, number>>(
    fixedAnomaliesSeries,
    (acc: Map<number, number>, el: IUnixTimePoint) => {
      acc.set(el.unix, el.value);
      return acc;
    },
    new Map<number, number>());

  return _.map(rawSeries, (el) => ({
    unix: el.unix,
    value: fixedAnomaliesSeriesMap.get(el.unix) !== el.value ? 1 : 0,
  }));
};