import * as _ from 'lodash';
import { put, takeEvery, take, select } from 'redux-saga/effects';
import { ISite, IProject } from '../../models';
import {
  HIDE_PROJECT_DEFINITION_MODAL,
  GET_SITES_FOR_PROJECT_FULFILLED,
  SHOW_PROJECT_DEFINITION_MODAL,
  ADD_PROJECT_FULFILLED,
} from '../action-types';
import {
  GetSitesForProjectStartedAction, GetChannelsForSiteStartedAction, AddProjectStartedAction, GoToAnomaliesScreenAction,
  HideProjectDefinitionModalAction,
  ShowProjectDefinitionModalAction,
} from '../actions';
import { IState } from '@app-state/.';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* showProjectDefinitionModal(action: ShowProjectDefinitionModalAction) {
  try {
    const asdf = action.payload;
    yield put(_.toPlainObject(new GetSitesForProjectStartedAction('Emerald_AECOM')));
    yield take(GET_SITES_FOR_PROJECT_FULFILLED);
    const sites: ISite[] = yield select((state: IState) => state.projectsScreen.sites);
    yield put(_.toPlainObject(new GetChannelsForSiteStartedAction(_.head(sites).id)));
  } catch (error) {
    // todo notify when error occurs
  }
}

function* hideProjectDefinitionModal(action: HideProjectDefinitionModalAction) {
  try {
    if (action.payload.approved) {
      yield put(_.toPlainObject(new AddProjectStartedAction(action.payload.project)));
      yield take(ADD_PROJECT_FULFILLED);
      const project: IProject = yield select((state: IState) => _.last(state.projectsScreen.projects));
      yield put(_.toPlainObject(new GoToAnomaliesScreenAction(project)));
    }
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchShowProjectDefinitionModal() {
  yield takeEvery(SHOW_PROJECT_DEFINITION_MODAL, showProjectDefinitionModal);
}

export function* watchHideProjectDefinitionModal() {
  yield takeEvery(HIDE_PROJECT_DEFINITION_MODAL, hideProjectDefinitionModal);
}