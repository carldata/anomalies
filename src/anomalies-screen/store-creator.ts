import * as _ from 'lodash';
import { ParseResult } from 'papaparse';
import { Action, handleActions } from 'redux-actions';
import { csvLoadingAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IHpTimeSeriesChartState } from 'time-series-scroller';
import { EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
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

    let newChartState: IHpTimeSeriesChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();

    _.forEach(action.payload, (value, key) => {
      if (key === 0) {
        let [cs, timeseries] = csvLoadingAuxiliary.receivedCsvDataChunk(state.chartState, true, value.data, {
          rawFormat: EnumRawCsvFormat.DateTimeThenValue,
          timeStampColumnName: 'time',
          valueColumnName: 'value',
        } as IExtractUnixTimePointsConfig);
        newChartState = cs;
      } else {
        let [cs, timeseries] = csvLoadingAuxiliary.receivedCsvDataChunk(state.chartState, true, value.data, {
          rawFormat: EnumRawCsvFormat.DateTimeThenValue,
          timeStampColumnName: 'time',
          valueColumnName: 'value',
        } as IExtractUnixTimePointsConfig);

        timeseries.color = 'red';
        newChartState.series.push(timeseries);
      }

    });

    return _.extend({}, state, { chartState: newChartState } as IAnomaliesScreenState);
  }
}, initialState);
