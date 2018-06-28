import axios from 'axios';
import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as Papa from 'papaparse';
import { push } from 'react-router-redux';
import { takeEvery, call, all, put, select } from 'redux-saga/effects';
import {
  EnumTimeSeriesType,
  hpTimeSeriesChartAuxiliary,
  hpTimeSeriesChartReducerAuxFunctions,
  IExternalSourceTimeSeries,
  IHpTimeSeriesChartState,
} from 'time-series-scroller';
import {
  csvLoadingCalculations,
  EnumRawCsvFormat,
  IExtractUnixTimePointsConfig,
} from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';

import { IDataGridState } from '../controls/data-grid/state';
import { requests } from '../../requests';
import { ShowGeneralMessageModalAction, HideGeneralMessageModalAction } from '../../components/modal';
import { IProject } from '../../models';
import { IAnomaliesTimeSeries, ITimeSeries } from '../models/anomalies-time-series';
import { IState } from '../../state';
import { GetTimeSeriesFulfilledAction, GetTimeSeriesStartAction } from '../actions';
import { GET_TIME_SERIES_START } from '../action-types';
import { handleErrorInSaga } from '@common/handle-error-in-saga';

function* getTimeSeries(action: GetTimeSeriesStartAction) {
  const project: IProject = yield select((state: IState) => state.anomaliesScreen.project);
  const startDate: string = action.payload.dateFrom;
  const endDate: string = action.payload.dateTo;

  try {
    yield put(_.toPlainObject(new ShowGeneralMessageModalAction()));

    yield select((state: IState) => state.anomaliesScreen.project);

    const rawChannelResponse: string = yield requests.getChannelData(`${project.siteId}-${project.rawChannelId}`, startDate, endDate);
    const fixedAnomaliesResponse: string = yield requests.getFixedAnomalies(`${project.siteId}-${project.rawChannelId}`, startDate, endDate);
    const editedChannelResponse: string = yield requests.getChannelData(`${project.siteId}-${project.finalChannelId}`, startDate, endDate);

    const rawChannelParseResult = Papa.parse(rawChannelResponse, { header: true });
    const fixedAnomaliesParseResult = Papa.parse(fixedAnomaliesResponse, { header: true });
    const editedChannelParseResult = Papa.parse(editedChannelResponse, { header: true });

    let supportingChannelsParseResults: Papa.ParseResult[] = [];
    if (project.supportingChannels.length > 0) {
      const supportingChannelsResults: string[] = yield requests.getSupportingChannels(project.supportingChannels, startDate, endDate);
      supportingChannelsParseResults = _.map(supportingChannelsResults, (result) => Papa.parse(result, { header: true }));
    }

    const toUnixTimePointsExtractConfig = {
      rawFormat: EnumRawCsvFormat.DateTimeThenValue,
      timeStampColumnName: 'time',
      valueColumnName: 'value',
    } as IExtractUnixTimePointsConfig;

    const rawSeries: ITimeSeries = csvLoadingCalculations.extractUnixTimePoints(rawChannelParseResult.data, toUnixTimePointsExtractConfig);
    const anomaliesSeries: ITimeSeries = csvLoadingCalculations.extractUnixTimePoints(fixedAnomaliesParseResult.data, toUnixTimePointsExtractConfig);
    const mergedAnomaliesSeries = _.map(rawSeries, (raw) => {
      const res = _.find(anomaliesSeries, (anomaly) => raw.unix == anomaly.unix);
      return _.isUndefined(res) ? raw : res;
    })

    yield put(_.toPlainObject(new GetTimeSeriesFulfilledAction({
      rawSeries,
      editedChannelSeries: csvLoadingCalculations.extractUnixTimePoints(editedChannelParseResult.data, toUnixTimePointsExtractConfig),
      fixedAnomaliesSeries: mergedAnomaliesSeries,
      supportingChannels: _.map(project.supportingChannels, (ch) =>
        csvLoadingCalculations.extractUnixTimePoints(supportingChannelsParseResults[_.indexOf(project.supportingChannels, ch)].data, toUnixTimePointsExtractConfig)),
    } as IAnomaliesTimeSeries)));
    yield put(_.toPlainObject(new HideGeneralMessageModalAction()));
  } catch (error) {
    yield handleErrorInSaga(error);
  }
}

export function* watchGetTimeSeries() {
  yield takeEvery(GET_TIME_SERIES_START, getTimeSeries);
}