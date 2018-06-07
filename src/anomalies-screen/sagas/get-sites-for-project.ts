import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { ISite } from '../../model';
import { IChannel } from '../../model';

// function* getSitesForProject(action) {
//   try {
//     yield put({ type: anomaliesScreenActionTypes.GET_SITES_FOR_PROJECT_ANOMALIES_FETCHING });
//     const sites: ISite[] = yield Requests.getSites(action.payload);
//     yield put({ type: anomaliesScreenActionTypes.GET_SITES_FOR_PROJECT_ANOMALIES_FULFILED, payload: sites });
//   } catch (error) {
//     // todo notify when error occurred
//   }
// }

// export function* watchGetSitesForProjectAnomalies() {
//   yield takeEvery(anomaliesScreenActionTypes.GET_SITES_FOR_PROJECT_ANOMALIES_START, getSitesForProject);
//}