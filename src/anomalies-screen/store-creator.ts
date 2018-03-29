import * as _ from 'lodash';
import { ParseResult } from 'papaparse';
import { Action, handleActions } from 'redux-actions';
import { EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
   IHpTimeSeriesChartState } from 'time-series-scroller';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { } from 'time-series-scroller/src/hp-time-seires';
import { anomaliesScreenActionTypes } from './action-creators';
import { IAnomaliesScreenState } from './state';

const initialState = {
  anotherDummyText: 'heloo oooo ooo ooo ooo',
  chartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, string | ParseResult[]>({
  [anomaliesScreenActionTypes.ANOMALY_TEST_ACTION]: (state: IAnomaliesScreenState, action: Action<string>) => {
    return _.extend({}, state, { anotherDummyText: action.payload } as IAnomaliesScreenState);
  },
  [anomaliesScreenActionTypes.GET_ANOMALIES_FULFILED]: (state: IAnomaliesScreenState, action: Action<ParseResult[]>) => {

    const sourceTimeSeries: IExternalSourceTimeSeries[] = [];

    sourceTimeSeries.push({
      color: 'steelblue',
      name: 'raw',
      points: csvLoadingCalculations.extractUnixTimePoints(action.payload[0].data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        type: EnumTimeSeriesType.Line,
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
    } as IExternalSourceTimeSeries);

    sourceTimeSeries.push({
      color: 'red',
      name: 'anomalies',
      points: csvLoadingCalculations.extractUnixTimePoints(action.payload[1].data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        type: EnumTimeSeriesType.Dots,
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
    } as IExternalSourceTimeSeries);

    const newChartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource(sourceTimeSeries);
    return _.extend({}, state, { chartState: newChartState } as IAnomaliesScreenState);
  },
}, initialState);
