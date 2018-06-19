import * as _ from 'lodash';
import {
  GetTimeSeriesStartAction,
  AddAndPopulateChannelStartAction,
  GoToProjectsScreenAction,
  DeleteSupportingChannelAction,
  SaveProjectStartAction,
  ShowSupportingChannelModalStartAction,
  HideSupportingChannelModalAction,
} from './actions';
import { ITimeSeriesLoadContext } from './models/time-series-load-context';
import { ISiteChannelInfo } from '../models';
import { IProject } from '@models/project';

export type IGetTimeSeriesActionCreator = (ctx: ITimeSeriesLoadContext) => GetTimeSeriesStartAction;
export type IAddAndPopulateChanneActionCreator = (siteChannelInfo: ISiteChannelInfo, dateFrom: string, dateTo: string) => AddAndPopulateChannelStartAction;
export type IGoToProjectsScreenActionCreator = () => GoToProjectsScreenAction;
export type IDeleteSupportingChannelActionCreator = (idx: number) => DeleteSupportingChannelAction;
export type ISaveProjectActionCreator = (project: IProject) => SaveProjectStartAction;
export type IShowSupportingChannelModalActionCreator = () => ShowSupportingChannelModalStartAction;
export type IHideSupportingChannelModalActionCreator = () => HideSupportingChannelModalAction;

export const getTimeSeries: IGetTimeSeriesActionCreator = (ctx: ITimeSeriesLoadContext) =>
  _.toPlainObject(new GetTimeSeriesStartAction(ctx));

export const addAndPopulateChannel: IAddAndPopulateChanneActionCreator = (siteChannelInfo: ISiteChannelInfo, dateFrom: string, dateTo: string) =>
  _.toPlainObject(new AddAndPopulateChannelStartAction({ siteChannelInfo, dateFrom, dateTo }));

export const goToProjectsScreen: IGoToProjectsScreenActionCreator = () =>
  _.toPlainObject(new GoToProjectsScreenAction());

export const deleteSupportingChannel: IDeleteSupportingChannelActionCreator = (idx: number) =>
  _.toPlainObject(new DeleteSupportingChannelAction(idx));

export const saveProject: ISaveProjectActionCreator = (project: IProject) =>
  _.toPlainObject(new SaveProjectStartAction(project));

export const showSupportingChannelModal: IShowSupportingChannelModalActionCreator = () =>
  _.toPlainObject(new ShowSupportingChannelModalStartAction());

export const hideSupportingChannelModal: IHideSupportingChannelModalActionCreator = () =>
  _.toPlainObject(new HideSupportingChannelModalAction());