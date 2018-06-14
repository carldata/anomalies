import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import { Action, handleActions } from 'redux-actions';
import {
  hpTimeSeriesChartReducerAuxFunctions, IHpTimeSeriesChartState,
} from 'time-series-scroller';
import { IAnomaliesScreenState } from './models/anomalies-screen-state';
import { anomaliesScreenActionTypes } from './action-creators';
import { IDataGridState } from './controls/data-grid/state';
import { IProject, IChannel, IProjectSupportingChannel, ISitesChannels } from '../models';
import { IShowAddChannelPayload } from './models/show-add-channel-payload';
import { IAnomaliesTimeSeries, ITimeSeries } from './models/anomalies-time-series';

export interface IAnomaliesCharts {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: IHpTimeSeriesChartState[];
  lastStartDate: string;
  lastEndDate: string;
}

const endDate = dateFns.startOfDay(new Date());

const initialState = {
  timeSeries: {
    rawSeries: [],
    fixedAnomaliesSeries: [],
    editedChannelSeries: [],
    supportingChannels: [],
  },
  project: {} as IProject,
  lastStartDate: dateFns.format(dateFns.subMonths(endDate, 3), 'YYYY-MM-DDTHH:mm:ss'),
  lastEndDate: dateFns.format(endDate, 'YYYY-MM-DDTHH:mm:ss'),
  showAddSupportingChannelModal: false,
  sites: [],
  channels: [],
  mainChartEmpty: true,
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState | IAnomaliesTimeSeries | IDataGridState | IProject | number | any | ISitesChannels| IShowAddChannelPayload | IChannel[]>({
  // TODO: fix the payload
  [anomaliesScreenActionTypes.GET_TIME_SERIES_FULFILLED]: (state: IAnomaliesScreenState, action: Action<IAnomaliesTimeSeries>) => {
    return {
      ...state,
      timeSeries: {
        rawSeries: action.payload.rawSeries,
        editedChannelSeries: action.payload.editedChannelSeries,
        fixedAnomaliesSeries: action.payload.fixedAnomaliesSeries,
        supportingChannels: action.payload.supportingChannels,
      },
    } as IAnomaliesScreenState;
  },
  [anomaliesScreenActionTypes.COPY_RAW_TO_EDITED]: (state: IAnomaliesScreenState, action: Action<IDataGridState>) => {
    return _.extend({}, state, { gridState: action.payload });
  },
  [anomaliesScreenActionTypes.PASS_PROJECT_TO_ANOMALIES]: (state: IAnomaliesScreenState, action: Action<IProject>) => {
    return _.extend({}, state, {
      project: action.payload,
      timeSeries: {
        rawSeries: [],
        fixedAnomaliesSeries: [],
        editedChannelSeries: [],
        supportingChannels: [],
      },
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
      supportingChannels: _.concat(state.timeSeries.supportingChannels, []),
      showAddSupportingChannelModal: false,
    } as IAnomaliesScreenState;
  },
  [anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILLED]: (state: IAnomaliesScreenState, action: Action<any>) => {
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
      timeSeries: {
        ...state.timeSeries,
        supportingChannels: _.concat(state.timeSeries.supportingChannels, [action.payload.timeSeries]),
      },
      showAddSupportingChannelModal: false,
    } as IAnomaliesScreenState;
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
      timeSeries: {
        ...state.timeSeries,
        supportingChannels: [
          ..._.slice(state.timeSeries.supportingChannels, 0, action.payload),
          ..._.slice(state.timeSeries.supportingChannels, action.payload + 1, state.timeSeries.supportingChannels.length),
        ],
      },
    } as IAnomaliesScreenState;
  },
  [anomaliesScreenActionTypes.CANCEL_SHOW_ADD_CHANNEL]: (state: IAnomaliesScreenState) => {
    return {
      ...state,
      showAddSupportingChannelModal: false,
    } as IAnomaliesScreenState;
  },
  [anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_FULFILED]: (state: IAnomaliesScreenState, action: Action<IShowAddChannelPayload>) => {
    return {
      ...state,
      sites:  action.payload.sites,
      channels: action.payload.channels,
      showAddSupportingChannelModal: true,
      mainChartEmpty: action.payload.mainChartEmpty,
    } as IAnomaliesScreenState;
  },
  [anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_FULFILLED] : (state: IAnomaliesScreenState, action: Action<IChannel[]>) => {
    return {
      ...state,
      channels: action.payload,
    } as IAnomaliesScreenState;
  },
}, initialState);
