import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { Requests } from '../../requests';
import { ISite } from '../../model';
import { GET_SITES_FOR_PROJECT_STARTED } from '../action-types';
import { GetSitesForProjectFetchingAction, GetSitesForProjectFulfilledAction } from '../actions';

function* getSitesForProject(action) {
  try {
    yield put(_.toPlainObject(new GetSitesForProjectFetchingAction()));
    const sites: ISite[] = yield Requests.getSites(action.payload);
    yield put(_.toPlainObject(new GetSitesForProjectFulfilledAction(sites)));
  } catch (error) {
    // todo notify when error occurred
  }
}

export function* watchGetSitesForProject() {
  yield takeEvery(GET_SITES_FOR_PROJECT_STARTED, getSitesForProject);
}