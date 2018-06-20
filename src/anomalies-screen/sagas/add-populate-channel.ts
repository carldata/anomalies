import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as Papa from 'papaparse';
import { takeEvery, put } from 'redux-saga/effects';
import {
  EnumTimeSeriesType,
  hpTimeSeriesChartAuxiliary,
  hpTimeSeriesChartReducerAuxFunctions,
  IExternalSourceTimeSeries,
  IHpTimeSeriesChartState,
} from 'time-series-scroller';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from '../../components/modal';
import { requests } from '../../requests';
import { config } from '../../config';
import {
  AddAndPopulateChannelFullfilledAction,
  AddAndPopulateChannelStartAction,
} from '../actions';
import { ADD_AND_POPULATE_CHANNEL_START } from '../action-types';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* addAndPopulateChannel(action: AddAndPopulateChannelStartAction) {
  try {
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction()));

    const siteId: string = action.payload.siteChannelInfo.siteId;
    const channelId: string = action.payload.siteChannelInfo.channelId;
    const dateFrom: string = dateFns.format(action.payload.dateFrom, config.generic.endpointsDateFormat);
    const dateTo: string = dateFns.format(action.payload.dateTo, config.generic.endpointsDateFormat);

    yield put(_.toPlainObject(new ShowGeneralMessageModalAction()));

    const channelData = yield requests.getChannelData(siteId + '-' + channelId, dateFrom, dateTo);
    const channelParseResult = Papa.parse(channelData.data, { header: true });
    const timeSeries = csvLoadingCalculations.extractUnixTimePoints(channelParseResult.data, {
      rawFormat: EnumRawCsvFormat.DateTimeThenValue,
      timeStampColumnName: 'time',
      valueColumnName: 'value',
    } as IExtractUnixTimePointsConfig);

    yield put(_.toPlainObject(new AddAndPopulateChannelFullfilledAction({
      siteChannelInfo: action.payload.siteChannelInfo,
      channelTimeSeries: timeSeries,
    })));
    yield put(_.toPlainObject(new HideGeneralMessageModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchAddAndPopulateChannel() {
  yield takeEvery(ADD_AND_POPULATE_CHANNEL_START, addAndPopulateChannel);
}