import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IChannel } from '../../model';
import { IProject } from '../state';
import { ShowModalAction, HideModalAction } from '../../components/modal';

function* getAllProjectsAsyncCall() {
  try {
    const projectsArray = [];
    yield put(_.toPlainObject(new ShowModalAction()));
    const response = yield Requests.getConfiguration();
    yield put(_.toPlainObject(new HideModalAction()));

    for (const element of response.data) {
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