import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { IProject } from './models/project';
import {
  GetAllProjectsStartedAction,
  GoToAnomaliesScreenAction,
  ShowAddProjectStartedAction,
  CancelShowAddProjectAction,
  AddProjectStartedAction,
  GetSitesForProjectStartedAction,
  GetChannelsForSiteStartedAction,
} from './actions';
import _ = require('lodash');

type IGetAllProjectsActionCreator = () => GetAllProjectsStartedAction;
type IGoToAnomaliesScreenActionCreator = (project: IProject) => GoToAnomaliesScreenAction;
type IShowAddProjectActionCreator = () => ShowAddProjectStartedAction;
type ICancelShowAddProjectActionCreator = () => CancelShowAddProjectAction;
type IAddProjectActionCreator = (project: IProject) => AddProjectStartedAction;
type IGetSitesForProjectActionCreator = (db: string) => GetSitesForProjectStartedAction;
type IGetChannelsForSiteActionCreator = (siteId: string) => GetChannelsForSiteStartedAction;

const getAllProjects: IGetAllProjectsActionCreator = () =>
  _.toPlainObject(new GetAllProjectsStartedAction());

const goToAnomaliesScreen: IGoToAnomaliesScreenActionCreator = (project: IProject) =>
  _.toPlainObject(new GoToAnomaliesScreenAction(project));

const showAddProject: IShowAddProjectActionCreator = () =>
  _.toPlainObject(new ShowAddProjectStartedAction());

const cancelShowAddProject: ICancelShowAddProjectActionCreator = () =>
  _.toPlainObject(new CancelShowAddProjectAction());

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
  IShowAddProjectActionCreator,
  showAddProject,
  ShowAddProjectStartedAction,
  ICancelShowAddProjectActionCreator,
  cancelShowAddProject,
  IAddProjectActionCreator,
  addProject,
  IGetSitesForProjectActionCreator,
  getSites,
  IGetChannelsForSiteActionCreator,
  getChannelsForSite,
};