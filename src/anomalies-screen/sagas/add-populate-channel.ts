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
import { ShowModalAction, HideModalAction } from '../../components/modal';
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
    yield put(_.toPlainObject(new ShowModalAction()));

    const site: string = action.payload.siteChannelInfo.site;
    const channel: string = action.payload.siteChannelInfo.channel;
    const dateFrom: string = dateFns.format(action.payload.dateFrom, config.generic.endpointsDateFormat);
    const dateTo: string = dateFns.format(action.payload.dateTo, config.generic.endpointsDateFormat);

    yield put(_.toPlainObject(new ShowModalAction()));

    const channelData = yield requests.getChannelData(site + '-' + channel, dateFrom, dateTo);
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
  } catch (error) {
    yield handleErrorInSaga(error);
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  }
}

export function* watchAddAndPopulateChannel() {
  yield takeEvery(ADD_AND_POPULATE_CHANNEL_START, addAndPopulateChannel);
}