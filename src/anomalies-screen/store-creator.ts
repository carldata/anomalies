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
import * as dateFns from 'date-fns';

export interface IAnomaliesCharts{
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: { site: string, channel: string, chartState: IHpTimeSeriesChartState }[];
  lastStartDate: string;
  lastEndDate: string;
}

const endDate = dateFns.startOfDay(new Date());

const initialState = {
  mainChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
  finalChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
  supportingChannels: [],
  gridState: { series: [] },
  project: {} as IProject,
  lastStartDate: dateFns.format(dateFns.subMonths(endDate,3),'YYYY-MM-DDTHH:mm:ss'),
  lastEndDate: dateFns.format(endDate,'YYYY-MM-DDTHH:mm:ss'),
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, IAnomaliesCharts | IDataGridState | IProject | any>({
  [anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED]: (state: IAnomaliesScreenState, action: Action<IAnomaliesCharts>) => {
    return _.extend({}, state, { 
      mainChartState: action.payload.mainChartState,
      finalChartState: action.payload.finalChartState,
      supportingChannels: action.payload.supportingChannels,
      lastStartDate: action.payload.lastStartDate,
      lastEndDate: action.payload.lastEndDate,
     });
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
  [anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL]: (state: IAnomaliesScreenState, action: Action<any>) => {
    return {
      ...state,
      project: {
        ...state.project,
        supportingChannels: _.concat(state.project.supportingChannels,{ 
          site: action.payload.siteChannelInfo.site, 
          channel: action.payload.siteChannelInfo.channel,
          type: action.payload.siteChannelInfo.type, 
        })
      },
      supportingChannels: _.concat(state.supportingChannels,{
        site: action.payload.siteChannelInfo.site,
        channel: action.payload.siteChannelInfo.channel,
        chartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(), 
      })
    }
  },
  [anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILED]: (state: IAnomaliesScreenState, action: Action<any>) => {
    return {
      ...state,
      project: {
        ...state.project,
        supportingChannels: _.concat(state.project.supportingChannels,{ 
          site: action.payload.siteChannelInfo.site, 
          channel: action.payload.siteChannelInfo.channel,
          type: action.payload.siteChannelInfo.type, 
        })
      },
      supportingChannels: _.concat(state.supportingChannels,{
        site: action.payload.siteChannelInfo.site,
        channel: action.payload.siteChannelInfo.channel,
        chartState: action.payload.channelChartState, 
      })
    }
  }
}, initialState);
