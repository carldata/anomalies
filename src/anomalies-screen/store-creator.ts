import * as _ from 'lodash';
import { ParseResult } from 'papaparse';
import { Action, handleActions } from 'redux-actions';
import {
  EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
  IHpTimeSeriesChartState,
} from 'time-series-scroller';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { anomaliesScreenActionTypes } from './action-creators';
import { IAnomaliesScreenState } from './state';
import { IState } from '../state';
import { IDataGridState } from './controls/data-grid/state';
import { IProject, IProjectSupportingChannel } from '../projects-screen/state';
import { channel } from 'redux-saga';
import * as dateFns from 'date-fns';
import { ISitesChannels, IShowAddChannelPayload } from '../model';

export interface IAnomaliesCharts {
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
  gridState: { rows: [] },
  project: {} as IProject,
  lastStartDate: dateFns.format(dateFns.subMonths(endDate, 3), 'YYYY-MM-DDTHH:mm:ss'),
  lastEndDate: dateFns.format(endDate, 'YYYY-MM-DDTHH:mm:ss'),
  showModal: false,
  sites: [],
  channels: [],
  mainChartEmpty: true,
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, IAnomaliesCharts | IDataGridState | IProject | number | any | ISitesChannels| IShowAddChannelPayload>({
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
      supportingChannels: _.map(action.payload.supportingChannels, (el) => {
        return {
          site: el.site,
          channel: el.channel,
          chartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
        };
      }),
    } as IAnomaliesScreenState);
  },
  [anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL]: (state: IAnomaliesScreenState, action: Action<any>) => {
    return {
      ...state,
      project: {
        ...state.project,
        supportingChannels: _.concat(state.project.supportingChannels, {
          site: action.payload.siteChannelInfo.site,
          siteId: '',
          channel: action.payload.siteChannelInfo.channel,
          channelId: '',
          type: action.payload.siteChannelInfo.type,
        } as IProjectSupportingChannel),
      },
      supportingChannels: _.concat(state.supportingChannels, {
        site: action.payload.siteChannelInfo.site,
        channel: action.payload.siteChannelInfo.channel,
        chartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      }),
    };
  },
  [anomaliesScreenActionTypes.GET_SITES_FOR_PROJECT_ANOMALIES_FULFILED]: (state: IAnomaliesScreenState, action: Action<any>) => {
    return _.extend({}, state, { sites: action.payload.sites });
  },
  [anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILED]: (state: IAnomaliesScreenState, action: Action<any>) => {
    return {
      ...state,
      project: {
        ...state.project,
        supportingChannels: _.concat(state.project.supportingChannels, {
          site: action.payload.siteChannelInfo.site,
          siteId: '',
          channel: action.payload.siteChannelInfo.channel,
          channelId: '',
          type: action.payload.siteChannelInfo.type,
        } as IProjectSupportingChannel),
      },
      supportingChannels: _.concat(state.supportingChannels, {
        site: action.payload.siteChannelInfo.site,
        channel: action.payload.siteChannelInfo.channel,
        chartState: action.payload.channelChartState,
      }),
    };
  },
  [anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL]: (state: IAnomaliesScreenState, action: Action<number>) => {
    return {
      ...state,
      project: {
        ...state.project,
        supportingChannels: [
          ..._.slice(state.project.supportingChannels, 0, action.payload),
          ..._.slice(state.project.supportingChannels, action.payload + 1, state.project.supportingChannels.length)
        ],
      },
      supportingChannels: [
        ..._.slice(state.supportingChannels, 0, action.payload),
        ..._.slice(state.supportingChannels, action.payload + 1, state.supportingChannels.length)
      ],
    };
  },
  [anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILED]: (state: IAnomaliesScreenState, action: Action<ISitesChannels>) => {
    return {
      ...state,
      sites: action.payload.sites,
      channels: action.payload.channels,
    };
  },
  [anomaliesScreenActionTypes.CANCEL_SHOW_ADD_CHANNEL]: (state: IAnomaliesScreenState) => {
    return {
      ...state,
      showModal: false,
    };
  },
  [anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_FULFILED]: (state: IAnomaliesScreenState, action: Action<IShowAddChannelPayload>) =>{
    return {
      ...state,
      sites:  action.payload.sites,
      channels: action.payload.channels,
      showModal: true,
      mainChartEmpty: action.payload.mainChartEmpty,
    };
  },
}, initialState);
