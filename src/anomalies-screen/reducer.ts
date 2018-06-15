import * as _ from 'lodash';
import * as actionTypes from './action-types';
import {
  PASS_PROJECT_TO_ANOMALIES,
  GET_TIME_SERIES_FULFILLED,
  DELETE_SUPPORTING_CHANNEL,
  ADD_AND_POPULATE_CHANNEL_FULFILLED,
  SHOW_DEFINE_CHANNEL_MODAL_FULFILLED,
  CANCEL_DEFINE_CHANNEL_MODAL,
  GET_CHANNELS_FOR_SITE_FULFILLED,
} from './action-types';
import {
  GetTimeSeriesFulfilledAction,
  PassProjectToAnomaliesAction,
  AddAndPopulateChannelFullfilledAction,
  DeleteSupportingChannelAction,
  CancelShowAddChannelModalAction,
  ShowDefineChannelModalStartAction,
  ShowDefineChannelModalFulfilledAction,
} from './actions';
import { GetChannelsForSiteFulfilledAction } from '../projects-screen/actions';
import { IAnomaliesScreenState } from './models/anomalies-screen-state';
import { IProjectSupportingChannel } from '@models/project-supporting-channel';

const initialState: IAnomaliesScreenState = {
  sites: [],
  channels: [],
  project: {},
  showAddSupportingChannelModal: false,
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
                    CancelShowAddChannelModalAction;

export const projectsScreenReducer = (state: IAnomaliesScreenState = initialState, action: ActionsTypes): IAnomaliesScreenState => {
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
            site: action.payload.siteChannelInfo.site,
            siteId: '',
            channel: action.payload.siteChannelInfo.channel,
            channelId: '',
            type: action.payload.siteChannelInfo.type,
          } as IProjectSupportingChannel),
        },
        timeSeries: {
          ...state.timeSeries,
          supportingChannels: _.concat(state.timeSeries.supportingChannels, [action.payload.channelTimeSeries]),
        },
        showAddSupportingChannelModal: false,
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
    case SHOW_DEFINE_CHANNEL_MODAL_FULFILLED:
      return {
        ...state,
        sites:  action.payload.sites,
        channels: action.payload.channels,
        showAddSupportingChannelModal: true,
      } as IAnomaliesScreenState;
    default:
      return state;
  }
};