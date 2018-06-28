import { takeEvery, put } from 'redux-saga/effects';
import { EDIT_PROJECT_STARTED } from '../action-types';
import { requests } from '../../requests';
import { handleErrorInSaga } from '@common/handle-error-in-saga';
import { EditProjectFulfilledAction, EditProjectStartedAction } from '../actions';
import _ = require('lodash');

function* editProject(action: EditProjectStartedAction) {
    try {
        const isRemoved = yield requests.deleteProject(action.type); // 'ok' is returned if request is finished, export it as request enums?
        yield put(_.toPlainObject(new EditProjectFulfilledAction()));
    } catch (error) {
        yield handleErrorInSaga(error);
    }
}

export function* watchEditProject() {
    yield takeEvery<EditProjectStartedAction>(EDIT_PROJECT_STARTED, editProject);
}