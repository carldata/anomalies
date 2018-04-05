import * as _ from 'lodash';
import { ParseResult } from 'papaparse';
import { Action, handleActions } from 'redux-actions';
import { EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
   IHpTimeSeriesChartState } from 'time-series-scroller';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { anomaliesScreenActionTypes } from './action-creators';
import { IAnomaliesScreenState } from './state';
import { IState } from '../state';
import { IDataGridState } from './controls/data-grid/state';

const initialState = {
  chartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
  gridState: { series: [] }
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, IHpTimeSeriesChartState | IDataGridState>({
  [anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED]: (state: IAnomaliesScreenState, action: Action<IHpTimeSeriesChartState>) => {
    return _.extend({}, state, { chartState: action.payload });
  },
  [anomaliesScreenActionTypes.GET_ANOMALIES_FOR_GRID_FULFILED]: (state: IAnomaliesScreenState, action: Action<IDataGridState>) => {
    return _.extend({}, state, {gridState: action.payload});
  }
}, initialState);
