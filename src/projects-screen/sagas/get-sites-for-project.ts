import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { ISite } from '../../models';
import { GET_SITES_FOR_PROJECT_STARTED } from '../action-types';
import { GetSitesForProjectFetchingAction, GetSitesForProjectFulfilledAction } from '../actions';
import { ShowModalAction, HideModalAction } from '../../components/modal';

function* getSitesForProject(action) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    yield put(_.toPlainObject(new GetSitesForProjectFetchingAction()));
    const sites: ISite[] = yield requests.getSites(action.payload);
    yield put(_.toPlainObject(new GetSitesForProjectFulfilledAction(sites)));
  } catch (error) {
    // todo notify when error occurred
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  } 
}

export function* watchGetSitesForProject() {
  yield takeEvery(GET_SITES_FOR_PROJECT_STARTED, getSitesForProject);
}