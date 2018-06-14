import * as _ from 'lodash';
import { put, takeEvery, select } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { IState } from '../../state';
import { IDataGridState, IDataGridRow } from '../controls/data-grid/state';
import { IDeleteSupportingChannelPayload } from '../models/delete-supporting-channel-payload';

function* deleteSupportingChannel(action) {
  const gridState: IDataGridState = yield select((state: IState) => state.anomaliesScreen.gridState);
  const newGridStateRows: IDataGridRow[] = _.map(gridState.rows, (row) => {
    const extendedValues: any[] = [
      row.extendedValue1,
      row.extendedValue2,
      row.extendedValue3,
      row.extendedValue4,
      row.extendedValue5,
    ];

    const newExtendedValues: any[] = [
      ..._.slice(extendedValues, 0, action.payload),
      ..._.slice(extendedValues, action.payload + 1, extendedValues.length),
      null,
    ];

    return {
      ...row,
      extendedValue1: newExtendedValues[0],
      extendedValue2: newExtendedValues[1],
      extendedValue3: newExtendedValues[2],
      extendedValue4: newExtendedValues[3],
      extendedValue5: newExtendedValues[4],
    } as IDataGridRow;

  });


  yield put({ type: anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL, payload: {
    idx: action.payload,
    rows: newGridStateRows,
  } as IDeleteSupportingChannelPayload });
}

export function* watchDeleteSupportingChannel() {
  yield takeEvery(anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL_START, deleteSupportingChannel);
}