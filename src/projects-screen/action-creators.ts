import * as _ from 'lodash';
import { IProject } from '../models';
import {
  GetAllProjectsStartedAction,
  GoToAnomaliesScreenAction,
  AddProjectStartedAction,
  GetSitesForProjectStartedAction,
  GetChannelsForSiteStartedAction,
  ShowProjectDefinitionModalAction,
  HideProjectDefinitionModalAction,
  DeleteProjectStartedAction,
  EditProjectStartedAction,
} from './actions';

export type IGetAllProjectsActionCreator = () => GetAllProjectsStartedAction;
export type IGoToAnomaliesScreenActionCreator = (project: IProject) => GoToAnomaliesScreenAction;
export type IShowProjectDefintionModalActionCreator = () => ShowProjectDefinitionModalAction;
export type IHideProjectDefintionModalActionCreator = (project: IProject, approved: boolean) => HideProjectDefinitionModalAction;
export type IAddProjectActionCreator = (project: IProject) => AddProjectStartedAction;
export type IGetSitesForProjectActionCreator = (db: string) => GetSitesForProjectStartedAction;
export type IGetChannelsForSiteActionCreator = (siteId: string) => GetChannelsForSiteStartedAction;
export type IDeleteProjectActionCreator = (projectId: string) => DeleteProjectStartedAction;
export type IEditProjectActionCreator = () => EditProjectStartedAction;

export const getAllProjects: IGetAllProjectsActionCreator = () =>
  _.toPlainObject(new GetAllProjectsStartedAction());

export const goToAnomaliesScreen: IGoToAnomaliesScreenActionCreator = (project: IProject) =>
  _.toPlainObject(new GoToAnomaliesScreenAction(project));

export const showProjectProjectDefinitionModal: IShowProjectDefintionModalActionCreator = () =>
  _.toPlainObject(new ShowProjectDefinitionModalAction());

export const hideProjectProjectDefinitionModal: IHideProjectDefintionModalActionCreator = (project: IProject, approved: boolean) =>
  _.toPlainObject(new HideProjectDefinitionModalAction({ project, approved }));

export const addProject: IAddProjectActionCreator = (project: IProject) =>
  _.toPlainObject(new AddProjectStartedAction(project));

export const getSites: IGetSitesForProjectActionCreator = (db: string) =>
  _.toPlainObject(new GetSitesForProjectStartedAction(db));

export const getChannelsForSite: IGetChannelsForSiteActionCreator = (siteId: string) =>
  _.toPlainObject(new GetChannelsForSiteStartedAction(siteId));

export const deleteProject: IDeleteProjectActionCreator = (projectId: string) =>
  _.toPlainObject(new DeleteProjectStartedAction(projectId));

export const editProject: IEditProjectActionCreator = () =>
  _.toPlainObject(new EditProjectStartedAction());

