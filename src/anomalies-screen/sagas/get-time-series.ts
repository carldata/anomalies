import axios from 'axios';
import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as Papa from 'papaparse';
import { push } from 'react-router-redux';
import { takeEvery, call, all, put } from 'redux-saga/effects';
import {
  EnumTimeSeriesType,
  hpTimeSeriesChartAuxiliary,
  hpTimeSeriesChartReducerAuxFunctions,
  IExternalSourceTimeSeries,
  IHpTimeSeriesChartState,
} from 'time-series-scroller';
// TODO: verify csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig should be exported in time-series-scroller
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';

import { anomaliesScreenActionTypes } from '../action-creators';
import { IDataGridState } from '../controls/data-grid/state';
import { requests } from '../../requests';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { IProject } from '../../models';
import { IAnomaliesTimeSeries } from '../models/anomalies-time-series';


function* getTimeSeries(action: any) {
  const project: IProject = action.payload.project;
  const startDate: string = action.payload.startDate;
  const endDate: string = action.payload.endDate;

  try {
    yield put(_.toPlainObject(new ShowModalAction()));

    const rawChannelResponse = yield requests.getChannelData(`${project.siteId}-${project.rawChannelId}`, startDate, endDate);
    const fixedAnomaliesResponse = yield requests.getFixedAnomalies(`${project.siteId}-${project.rawChannelId}`, startDate, endDate);
    const editedChannelResponse = yield requests.getChannelData(`${project.siteId}-${project.finalChannelId}`, startDate, endDate);

    const rawChannelParseResult = Papa.parse(rawChannelResponse.data, { header: true });
    const fixedAnomaliesParseResult = Papa.parse(fixedAnomaliesResponse.data, { header: true });
    const editedChannelParseResult = Papa.parse(editedChannelResponse.data, { header: true });

    let supportingChannelsParseResults: Papa.ParseResult[] = [];
    if (project.supportingChannels.length > 0) {
      const supportingChannelsResults = yield requests.getSupportingChannels(project.supportingChannels, startDate, endDate);
      supportingChannelsParseResults = _.map(supportingChannelsResults, (result) => Papa.parse(result.data, { header: true }));
    }

    const toUnixTimePointsExtractConfig = {
      rawFormat: EnumRawCsvFormat.DateTimeThenValue,
      timeStampColumnName: 'time',
      valueColumnName: 'value',
    } as IExtractUnixTimePointsConfig;

    yield put({
      type: anomaliesScreenActionTypes.GET_TIME_SERIES_FULFILLED, payload: {
        rawSeries: csvLoadingCalculations.extractUnixTimePoints(rawChannelParseResult.data, toUnixTimePointsExtractConfig),
        editedChannelSeries: csvLoadingCalculations.extractUnixTimePoints(editedChannelParseResult.data, toUnixTimePointsExtractConfig),
        fixedAnomaliesSeries: csvLoadingCalculations.extractUnixTimePoints(fixedAnomaliesParseResult.data, toUnixTimePointsExtractConfig),
        supportingChannels: _.map(project.supportingChannels, (ch) =>
          csvLoadingCalculations.extractUnixTimePoints(supportingChannelsParseResults[_.indexOf(project.supportingChannels, ch)].data, toUnixTimePointsExtractConfig)),
      } as IAnomaliesTimeSeries,
    });
  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.GET_TIME_SERIES_REJECTED, payload: error.message });
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  }
}

export function* watchGetTimeSeries() {
  yield takeEvery(anomaliesScreenActionTypes.GET_TIME_SERIES_START, getTimeSeries);
}