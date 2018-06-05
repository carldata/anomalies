import axios from 'axios';
import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from './action-creators';
import { anomaliesScreenActionTypes } from '../anomalies-screen/action-creators';
import { IProject } from './state';
import { Requests } from '../requests';
import { IState } from '../state';
import * as _ from 'lodash';
import { ISite, IChannel } from '../model';

function* goToAnomalies(action) {
  yield put({ type: anomaliesScreenActionTypes.PASS_PROJECT_TO_ANOMALIES, payload: action.payload });
  yield put(push('/anomalies'));
}

export function* watchGoToAnomalies() {
  yield takeEvery(projectsScreenActionTypes.GO_TO_ANOMALIES, goToAnomalies);
}

function* getAllProjectsAsyncCall() {
  try {
    var projectsArray = [];
    const response = yield Requests.getConfiguration()

    for (let element of response.data) {
      projectsArray.push({
        id: element.id,
        name: element.data.name,
        final: element.data.final,
        raw: element.data.raw,
        site: element.data.site,
        supportingChannels: _.isUndefined(element.data.supportingChannels) ? [] : element.data.supportingChannels,
      } as IProject);
    }

    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED, payload: projectsArray });
  } catch (error) {
    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_REJECTED, payload: error.message });
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START, getAllProjectsAsyncCall);
}

export function* showAddProject(action) {
  try {
    yield put({type: projectsScreenActionTypes.SHOW_ADD_PROJECT_FETCHING});
    const sites: ISite[] = yield Requests.getSites('FlowMetrix');
    const channels: IChannel[] = yield Requests.getChannels(_.head(sites).id);
    yield put({
       type: projectsScreenActionTypes.SHOW_ADD_PROJECT_FULFILED,
       payload: {
         sites,
         channels,
       },
      });
  } catch (error) {
    // todo notify when error occurs
  }
}

export function* watchShowAddNewProject() {
  yield takeEvery(projectsScreenActionTypes.SHOW_ADD_PROJECT_START, showAddProject);
}

export function* addNewProject(action) {
  try {
    let projectId: string = yield Requests.addProject(action.payload);
    yield put({
      type: projectsScreenActionTypes.ADD_PROJECT_FULFILED, payload: _.extend({}, action.payload, { id: projectId } as IProject)
    });
  } catch (error) {
    // todo notify error occured 
  }
}

export function* watchAddNewProject() {
  yield takeEvery(projectsScreenActionTypes.ADD_PROJECT_START, addNewProject)
}

function* getSitesForProject(action) {
  try {
    yield put({ type: projectsScreenActionTypes.GET_SITES_FOR_PROJECT_FETCHING });
    const sites: ISite[] = yield Requests.getSites(action.payload);
    yield put({ type: projectsScreenActionTypes.GET_SITES_FOR_PROJECT_FULFILED, payload: sites });
  } catch (error) {
    // todo notify when error occurred
  }
}

export function* watchGetSitesForProject() {
  yield takeEvery(projectsScreenActionTypes.GET_SITES_FOR_PROJECT_START, getSitesForProject);
}

function* getChannelsForSite(action) {
  try {
    yield put({ type: projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_FETCHING });
    const channels: IChannel[] = yield Requests.getChannels(action.payload);
    yield put({ type: projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_FULFILED, payload: channels });
  } catch (error) {
    // todo notify error
  }
}

export function* watchGetChannelsForSite() {
  yield takeEvery(projectsScreenActionTypes.GET_CHANNELS_FOR_SITE_START, getChannelsForSite);
}