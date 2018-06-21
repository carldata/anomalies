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
import { ISupportingChannel } from './models/supporting-channel';
import { IShowAddChannelPayload } from './models/show-add-channel-payload';
import { IDeleteSupportingChannelPayload } from './models/delete-supporting-channel-payload';

export interface IAnomaliesCharts {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: ISupportingChannel[];
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
  supportingChannelModalShown: false,
  timeSeries: null,
  timeSeriesLoadContext: null,
} as IAnomaliesScreenState;

export default handleActions<IAnomaliesScreenState, IAnomaliesCharts | IDataGridState | IProject | number | any |
  ISitesChannels | IShowAddChannelPayload | IChannel[] | IDeleteSupportingChannelPayload>({
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
        showModal: false,
      };
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
        gridState: {
          rows: (function mapRows() {
            const newChannelIndexValuesMap: Map<number, number> = action.payload.newChannelIndexValuesMap;
            return _.map(state.gridState.rows, (newRow) => {
              const timeKey = dateFns.parse(newRow.date).getTime();
              if (newChannelIndexValuesMap.has(timeKey)) {
                newRow[`extendedValue${state.project.supportingChannels.length + 1}`] = newChannelIndexValuesMap.get(timeKey);
              }
              return newRow;
            });
          }()),
        },
        supportingChannels: _.concat(state.supportingChannels, {
          site: action.payload.siteChannelInfo.site,
          channel: action.payload.siteChannelInfo.channel,
          chartState: action.payload.channelChartState,
        }),
        showModal: false,
      } as IAnomaliesScreenState;
    },
    [anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL]: (state: IAnomaliesScreenState, action: Action<IDeleteSupportingChannelPayload>) => {
      return {
        ...state,
        project: {
          ...state.project,
          supportingChannels: [
            ..._.slice(state.project.supportingChannels, 0, action.payload.idx),
            ..._.slice(state.project.supportingChannels, action.payload.idx + 1, state.project.supportingChannels.length)
          ],
        },
        supportingChannels: [
          ..._.slice(state.supportingChannels, 0, action.payload.idx),
          ..._.slice(state.supportingChannels, action.payload.idx + 1, state.supportingChannels.length),
        ],
        gridState: {
          rows: action.payload.rows,
        },
      };
    },
    [anomaliesScreenActionTypes.CANCEL_SHOW_ADD_CHANNEL]: (state: IAnomaliesScreenState) => {
      return {
        ...state,
        showModal: false,
      };
    },
    [anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_FULFILED]: (state: IAnomaliesScreenState, action: Action<IShowAddChannelPayload>) => {
      return {
        ...state,
        sites: action.payload.sites,
        channels: action.payload.channels,
        showModal: true,
        mainChartEmpty: action.payload.mainChartEmpty,
      };
    },
    [anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_FULFILED]: (state: IAnomaliesScreenState, action: Action<IChannel[]>) => {
      return {
        ...state,
        channels: action.payload,
      };
    },
  }, initialState);
