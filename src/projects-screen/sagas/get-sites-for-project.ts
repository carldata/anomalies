import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { ISite } from '../../model';

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