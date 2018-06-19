import * as _ from 'lodash';
import * as actionTypes from './action-types';
import {
  PASS_PROJECT_TO_ANOMALIES,
  GET_TIME_SERIES_FULFILLED,
  DELETE_SUPPORTING_CHANNEL,
  ADD_AND_POPULATE_CHANNEL_FULFILLED,
  SHOW_SUPPORTING_CHANNEL_MODAL_FULFILLED,
  HIDE_SUPPORTING_CHANNEL_MODAL,
  GET_CHANNELS_FOR_SITE_FULFILLED,
} from './action-types';
import {
  GetTimeSeriesFulfilledAction,
  PassProjectToAnomaliesAction,
  AddAndPopulateChannelFullfilledAction,
  DeleteSupportingChannelAction,
  HideSupportingChannelModalAction,
  ShowSupportingChannelModalStartAction,
  ShowDefineChannelModalFulfilledAction,
} from './actions';
import { GetChannelsForSiteFulfilledAction } from '../projects-screen/actions';
import { ISupportingChannel } from '@models/.';
import { IAnomaliesScreenState } from './models/anomalies-screen-state';

const initialState: IAnomaliesScreenState = {
  sites: [],
  channels: [],
  project: {},
  supportingChannelModalShown: false,
  timeSeries: {
    rawSeries: [],
    editedChannelSeries: [],
    fixedAnomaliesSeries: [],
    supportingChannels: [],
  },
  timeSeriesLoadContext: {},
} as IAnomaliesScreenState;

type ActionsTypes = GetTimeSeriesFulfilledAction|
                    PassProjectToAnomaliesAction|
                    GetChannelsForSiteFulfilledAction|
                    AddAndPopulateChannelFullfilledAction|
                    DeleteSupportingChannelAction|
                    ShowDefineChannelModalFulfilledAction|
                    HideSupportingChannelModalAction;

export const anomaliesScreenReducer = (state: IAnomaliesScreenState = initialState, action: ActionsTypes): IAnomaliesScreenState => {
  switch (action.type) {
    case PASS_PROJECT_TO_ANOMALIES:
      return _.extend({}, state, {
        project: action.payload,
        timeSeries: {
          rawSeries: [],
          fixedAnomaliesSeries: [],
          editedChannelSeries: [],
          supportingChannels: [],
        },
      } as IAnomaliesScreenState);
    case GET_TIME_SERIES_FULFILLED:
      return {
        ...state,
        timeSeries: {
          rawSeries: action.payload.rawSeries,
          editedChannelSeries: action.payload.editedChannelSeries,
          fixedAnomaliesSeries: action.payload.fixedAnomaliesSeries,
          supportingChannels: action.payload.supportingChannels,
        },
      } as IAnomaliesScreenState;
    case GET_CHANNELS_FOR_SITE_FULFILLED:
      return {
        ...state,
        channels: action.payload,
      } as IAnomaliesScreenState;
    case ADD_AND_POPULATE_CHANNEL_FULFILLED:
      return {
        ...state,
        project: {
          ...state.project,
          supportingChannels: _.concat(state.project.supportingChannels, {
            siteId: action.payload.siteChannelInfo.siteId,
            siteName: action.payload.siteChannelInfo.siteName,
            channelId: action.payload.siteChannelInfo.channelId,
            channelName: action.payload.siteChannelInfo.channelName,
            type: action.payload.siteChannelInfo.type,
          } as ISupportingChannel),
        },
        timeSeries: {
          ...state.timeSeries,
          supportingChannels: _.concat(state.timeSeries.supportingChannels, [action.payload.channelTimeSeries]),
        },
        supportingChannelModalShown: false,
      } as IAnomaliesScreenState;
    case DELETE_SUPPORTING_CHANNEL:
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
    case SHOW_SUPPORTING_CHANNEL_MODAL_FULFILLED:
      return {
        ...state,
        sites:  action.payload.sites,
        channels: action.payload.channels,
        supportingChannelModalShown: true,
      } as IAnomaliesScreenState;
    case HIDE_SUPPORTING_CHANNEL_MODAL:
      return {
        ...state,
        supportingChannelModalShown: false,
      } as IAnomaliesScreenState;
    default:
      return state;
  }
};