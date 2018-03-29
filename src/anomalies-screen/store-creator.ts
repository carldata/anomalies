import * as _ from 'lodash';
import { ParseResult } from 'papaparse';
import { Action, handleActions } from 'redux-actions';
import { EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
   IHpTimeSeriesChartState } from 'time-series-scroller';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { anomaliesScreenActionTypes } from './action-creators';
import { IAnomaliesScreenState } from './state';

const initialState = {
  chartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, ParseResult[]>({
  [anomaliesScreenActionTypes.GET_ANOMALIES_FULFILED]: (state: IAnomaliesScreenState, action: Action<ParseResult[]>) => {

    const sourceTimeSeries: IExternalSourceTimeSeries[] = [];

    sourceTimeSeries.push({
      color: 'steelblue',
      name: 'raw',
      points: csvLoadingCalculations.extractUnixTimePoints(action.payload[0].data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries);

    sourceTimeSeries.push({
      color: 'red',
      name: 'anomalies',
      points: csvLoadingCalculations.extractUnixTimePoints(action.payload[1].data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Dots,
    } as IExternalSourceTimeSeries);

    const newChartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource(sourceTimeSeries);
    return _.extend({}, state, { chartState: newChartState } as IAnomaliesScreenState);
  },
}, initialState);
