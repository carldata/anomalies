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

function* addAndPopulateChannel(action: any) {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FETCHING });

    const site: string = action.payload.siteChannelInfo.site;
    const channel: string = action.payload.siteChannelInfo.channel;
    const startDate: string = action.payload.startDate;
    const endDate: string = action.payload.endDate;

    yield put(_.toPlainObject(new ShowModalAction()));
    const channelData = yield requests.getChannelData(site + '-' + channel, startDate, endDate);
    yield put(_.toPlainObject(new HideModalAction()));
    const channelParseResult = Papa.parse(channelData.data, { header: true });
    const newChannelIndexValuesMap: Map<number, number> =
      _.reduce(channelParseResult.data,
               (acc: Map<number, number>, el) => acc.set(dateFns.parse(el.time).getTime(), el.value),
               new Map<number, number>());

    let channelChartState: IHpTimeSeriesChartState;
    if (channelParseResult.errors.length === 0) {
      channelChartState =
        hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
          color: 'steelblue',
          name: site + ' ' + channel,
          points: csvLoadingCalculations.extractUnixTimePoints(channelParseResult.data, {
            rawFormat: EnumRawCsvFormat.DateTimeThenValue,
            timeStampColumnName: 'time',
            valueColumnName: 'value',
          } as IExtractUnixTimePointsConfig),
          type: EnumTimeSeriesType.Line,
        } as IExternalSourceTimeSeries]);
    } else {
      channelChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
      channelChartState.dateRangeUnixFrom = dateFns.parse(startDate).getMilliseconds();
      channelChartState.dateRangeUnixTo = dateFns.parse(endDate).getMilliseconds();
    }

    yield put({
      type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILED, payload: {
        siteChannelInfo: action.payload.siteChannelInfo,
        channelChartState,
        newChannelIndexValuesMap,
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