import * as _ from 'lodash';
import { IUnixTimePoint } from 'time-series-scroller';
import { ITimeSeries } from '../models/anomalies-time-series';

const ANOMALIES_BARCHART_HEIGHT_RATIO = 1.0 / 10;

export const createAnomaliesTimeSeriesForScrollbar = (rawSeries: ITimeSeries, fixedAnomaliesSeries: ITimeSeries): ITimeSeries => {
  const fixedAnomaliesSeriesMap: Map<number, number> = _.reduce<IUnixTimePoint[], Map<number, number>>(
    fixedAnomaliesSeries,
    (acc: Map<number, number>, el: IUnixTimePoint) => {
      acc.set(el.unix, el.value);
      return acc;
    },
    new Map<number, number>());

  const rawSeriesMax = _.max(_.map(rawSeries, (el) => el.value));
  const rawSeriesMin = _.min(_.map(rawSeries, (el) => el.value));
  const minBarChartValue = rawSeriesMin >= 0 ? 0 : rawSeriesMin;

  return _.map(rawSeries, (el) => ({
    unix: el.unix,
    value: fixedAnomaliesSeriesMap.get(el.unix) !== el.value ? ANOMALIES_BARCHART_HEIGHT_RATIO * rawSeriesMax : minBarChartValue,
  }));
};