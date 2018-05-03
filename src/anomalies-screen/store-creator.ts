import * as _ from 'lodash';
import { ParseResult } from 'papaparse';
import { Action, handleActions } from 'redux-actions';
import {
  EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
  IHpTimeSeriesChartState
} from 'time-series-scroller';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { anomaliesScreenActionTypes } from './action-creators';
import { IAnomaliesScreenState } from './state';
import { IState } from '../state';
import { IDataGridState } from './controls/data-grid/state';
import { IProject } from '../projects-screen/state';
import { channel } from 'redux-saga';

const initialState = {
  mainChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
  finalChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
  supportingChannels: [],
  gridState: { series: [] },
  project: {} as IProject,
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, IHpTimeSeriesChartState | IDataGridState | IProject>({
  [anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED]: (state: IAnomaliesScreenState, action: Action<IHpTimeSeriesChartState>) => {
    return _.extend({}, state, { mainChartState: action.payload });
  },
  [anomaliesScreenActionTypes.GET_ANOMALIES_FOR_GRID_FULFILED]: (state: IAnomaliesScreenState, action: Action<IDataGridState>) => {
    return _.extend({}, state, { gridState: action.payload });
  },
  [anomaliesScreenActionTypes.COPY_RAW_TO_EDITED]: (state: IAnomaliesScreenState, action: Action<IDataGridState>) => {
    return _.extend({}, state, { gridState: action.payload });
  },
  [anomaliesScreenActionTypes.PASS_PROJECT_TO_ANOMALIES]: (state: IAnomaliesScreenState, action: Action<IProject>) => {
    return _.extend({}, state, { 
      project: action.payload, 
      mainChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      finalChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      supportingChannels: _.map(action.payload.supportingChannels,(el) =>{
        return { 
          site: el.site,
          channel: el.channel,
          chartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
        }
      }),
    } as IAnomaliesScreenState)
  },
}, initialState);
