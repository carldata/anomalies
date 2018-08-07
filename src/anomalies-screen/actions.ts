import { Action } from 'redux';
import * as actionTypes from './action-types';
import { ITimeSeriesLoadContext } from './models/time-series-load-context';
import { ISiteChannelInfo } from '@models/site-channel-info';
import { IProject } from '@models/project';
import { IAnomaliesTimeSeries, ITimeSeries } from './models/anomalies-time-series';
import { IChannel, ISite } from '../models';

// tslint:disable:max-classes-per-file
export class PassProjectToAnomaliesAction implements Action {
  public readonly type = actionTypes.PASS_PROJECT_TO_ANOMALIES;
  constructor(public payload: IProject) { }
}

export class GetTimeSeriesStartAction implements Action {
  public readonly type = actionTypes.GET_TIME_SERIES_START;
  constructor(public payload: ITimeSeriesLoadContext) { }
}

export class GetTimeSeriesFulfilledAction implements Action {
  public readonly type = actionTypes.GET_TIME_SERIES_FULFILLED;
  constructor(public payload: IAnomaliesTimeSeries) { }
}

export class GetTimeSeriesRejectedAction implements Action {
  public readonly type = actionTypes.GET_TIME_SERIES_FULFILLED;
  constructor(public payload: IAnomaliesTimeSeries) { }
}

export class GetChannelsForSiteAction implements Action {
  public readonly type = actionTypes.GET_CHANNELS_FOR_SITE_START;
  constructor(public payload: string) { } // site id
}

export class AddAndPopulateChannelStartAction implements Action {
  public readonly type = actionTypes.ADD_AND_POPULATE_CHANNEL_START;
  constructor(public payload: { siteChannelInfo: ISiteChannelInfo, dateFrom: string, dateTo: string }) { }
}

export class AddAndPopulateChannelFullfilledAction implements Action {
  public readonly type = actionTypes.ADD_AND_POPULATE_CHANNEL_FULFILLED;
  constructor(public payload: { siteChannelInfo: ISiteChannelInfo, channelTimeSeries: ITimeSeries }) { }
}

export class GoToProjectsScreenAction implements Action {
  public readonly type = actionTypes.GO_TO_PROJECTS;
}

export class DeleteSupportingChannelAction implements Action {
  public readonly type = actionTypes.DELETE_SUPPORTING_CHANNEL;
  constructor(public payload: number) { } // index
}

export class SaveProjectStartAction implements Action {
  public readonly type = actionTypes.SAVE_PROJECT_START;
  constructor(public payload: IProject) { }
}

export class SaveProjectFulfilledAction implements Action {
  public readonly type = actionTypes.SAVE_PROJECT_FULFILLED;
  constructor(public payload: IProject) { }
}

export class ShowSupportingChannelModalStartAction implements Action {
  public readonly type = actionTypes.SHOW_SUPPORTING_CHANNEL_MODAL_START;
}

export class ShowDefineChannelModalFulfilledAction implements Action {
  public readonly type = actionTypes.SHOW_SUPPORTING_CHANNEL_MODAL_FULFILLED;
  constructor(public payload: { channels: IChannel[], sites: ISite[] }) { }
}

export class HideSupportingChannelModalAction implements Action {
  public readonly type = actionTypes.HIDE_SUPPORTING_CHANNEL_MODAL;
}