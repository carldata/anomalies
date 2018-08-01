import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { ISite } from '../../models';
import { GET_SITES_FOR_PROJECT_STARTED } from '../action-types';
import { GetSitesForProjectFetchingAction, GetSitesForProjectFulfilledAction } from '../actions';
import { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from '../../components/modal';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* getSitesForProject(action) {
  try {
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction()));
    yield put(_.toPlainObject(new GetSitesForProjectFetchingAction()));
    const sites: ISite[] = yield requests().getSites(action.payload);
    yield put(_.toPlainObject(new
      GetSitesForProjectFulfilledAction(_.sortBy(
        sites,
        (el: ISite) => _.toUpper(el.name)))));
    yield put(_.toPlainObject(new HideGeneralMessageModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchGetSitesForProject() {
  yield takeEvery(GET_SITES_FOR_PROJECT_STARTED, getSitesForProject);
}