import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { IUnixTimePoint, IHpTimeSeriesChartState, IExternalSourceTimeSeries, EnumTimeSeriesType, hpTimeSeriesChartAuxiliary } from 'time-series-scroller';
import { IState } from '../../state';
import { IDataGridState } from '../controls/data-grid/state';
import { ITimeSeries, IAnomaliesTimeSeries } from '../models/anomalies-time-series';

interface IChartsState {
  rawChartState: IHpTimeSeriesChartState;
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: IHpTimeSeriesChartState[];
}

export const chartsSelector = createSelector<IState, IAnomaliesTimeSeries, IChartsState>(
  [(state: IState) => state.anomaliesScreen.timeSeries],
  (timeSeries: IAnomaliesTimeSeries) => ({
    rawChartState: hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
      color: 'steelblue',
      name: 'raw',
      points: timeSeries.rawSeries,
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries,
  ]),
    mainChartState: hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
      color: 'red',
      name: 'anomalies',
      points: timeSeries.fixedAnomaliesSeries,
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries,
     {
      color: 'steelblue',
      name: 'raw',
      points: timeSeries.rawSeries,
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries,
  ]),
    finalChartState: hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
      color: 'steelblue',
      name: 'final',
      points: timeSeries.editedChannelSeries,
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries]),
    supportingChannels: _.map(timeSeries.supportingChannels, (el, idx) =>
      hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
        color: 'steelblue',
        points: el,
        type: EnumTimeSeriesType.Line,
      } as IExternalSourceTimeSeries])),
  } as IChartsState),
);