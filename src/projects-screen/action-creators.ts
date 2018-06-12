import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { IProject } from './models/project';
import {
  GetAllProjectsStartedAction,
  GoToAnomaliesScreenAction,
  AddProjectStartedAction,
  GetSitesForProjectStartedAction,
  GetChannelsForSiteStartedAction,
  ShowProjectDefinitionModalAction,
  HideProjectDefinitionModalAction,
} from './actions';
import _ = require('lodash');

type IGetAllProjectsActionCreator = () => GetAllProjectsStartedAction;
type IGoToAnomaliesScreenActionCreator = (project: IProject) => GoToAnomaliesScreenAction;
type IShowProjectDefintionModalActionCreator = () => ShowProjectDefinitionModalAction;
type IHideProjectDefintionModalActionCreator = (project: IProject, approved: boolean) => HideProjectDefinitionModalAction;
type IAddProjectActionCreator = (project: IProject) => AddProjectStartedAction;
type IGetSitesForProjectActionCreator = (db: string) => GetSitesForProjectStartedAction;
type IGetChannelsForSiteActionCreator = (siteId: string) => GetChannelsForSiteStartedAction;

const getAllProjects: IGetAllProjectsActionCreator = () =>
  _.toPlainObject(new GetAllProjectsStartedAction());

const goToAnomaliesScreen: IGoToAnomaliesScreenActionCreator = (project: IProject) =>
  _.toPlainObject(new GoToAnomaliesScreenAction(project));

const showProjectProjectDefinitionModal: IShowProjectDefintionModalActionCreator = () =>
  _.toPlainObject(new ShowProjectDefinitionModalAction());

const hideProjectProjectDefinitionModal: IHideProjectDefintionModalActionCreator = (project: IProject, approved: boolean) =>
  _.toPlainObject(new HideProjectDefinitionModalAction({ project, approved }));

const addProject: IAddProjectActionCreator = (project: IProject) =>
  _.toPlainObject(new AddProjectStartedAction(project));

const getSites: IGetSitesForProjectActionCreator = (db: string) =>
  _.toPlainObject(new GetSitesForProjectStartedAction(db));

const getChannelsForSite: IGetChannelsForSiteActionCreator = (siteId: string) =>
  _.toPlainObject(new GetChannelsForSiteStartedAction(siteId));

export {
  IGetAllProjectsActionCreator,
  getAllProjects,
  IGoToAnomaliesScreenActionCreator,
  goToAnomaliesScreen,
  IShowProjectDefintionModalActionCreator,
  showProjectProjectDefinitionModal,
  IHideProjectDefintionModalActionCreator,
  hideProjectProjectDefinitionModal,
  IAddProjectActionCreator,
  addProject,
  IGetSitesForProjectActionCreator,
  getSites,
  IGetChannelsForSiteActionCreator,
  getChannelsForSite,
};