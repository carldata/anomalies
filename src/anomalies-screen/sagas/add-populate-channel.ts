import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as Papa from 'papaparse';
import { takeEvery, put } from 'redux-saga/effects';
import {
  EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries, IHpTimeSeriesChartState,
} from 'time-series-scroller';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { anomaliesScreenActionTypes } from '../action-creators';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { requests } from '../../requests';
import { config } from '../../config';

function* addAndPopulateChannel(action: any) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FETCHING });

    const site: string = action.payload.siteChannelInfo.site;
    const channel: string = action.payload.siteChannelInfo.channel;
    const startDate: string = dateFns.format(action.payload.unixFrom, config.generic.endpointsDateFormat);
    const endDate: string = dateFns.format(action.payload.unixTo, config.generic.endpointsDateFormat);

    yield put(_.toPlainObject(new ShowModalAction()));

    const channelData = yield requests.getChannelData(site + '-' + channel, startDate, endDate);
    const channelParseResult = Papa.parse(channelData.data, { header: true });
    const timeSeries = csvLoadingCalculations.extractUnixTimePoints(channelParseResult.data, {
      rawFormat: EnumRawCsvFormat.DateTimeThenValue,
      timeStampColumnName: 'time',
      valueColumnName: 'value',
    } as IExtractUnixTimePointsConfig);

    yield put({
      type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILLED, payload: {
        siteChannelInfo: action.payload.siteChannelInfo,
        timeSeries,
      },
    });
  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_REJECTED, payload: error })
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  }
}

export function* watchAddAndPopulateChannel() {
  yield takeEvery(anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_START, addAndPopulateChannel);
}