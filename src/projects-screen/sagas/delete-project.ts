import { takeEvery, put } from 'redux-saga/effects';
import { DeleteProjectDeletingAction, DeleteProjectFulfilledAction } from '../actions';
import { DELETE_PROJECT_STARTED } from '../action-types';
import { handleErrorInSaga } from '@common/handle-error-in-saga';
import { requests } from '../../requests';
import _ = require('lodash');

function* getChannelsForSite(action) {
    try {
        yield put(_.toPlainObject(new DeleteProjectDeletingAction(action.payload)));
        const isRemoved = yield requests.deleteProject(action.payload); // 'ok' is returned if request is finished, export it as request enums?
        yield put(_.toPlainObject(new DeleteProjectFulfilledAction(action.payload)));
    } catch (error) {
        yield handleErrorInSaga(error);
    }
}

export function* watchDeleteProject() {
    yield takeEvery(DELETE_PROJECT_STARTED, getChannelsForSite);
}