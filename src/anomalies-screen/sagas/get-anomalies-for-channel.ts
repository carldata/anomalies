import axios from 'axios';
import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as Papa from 'papaparse';
import { push } from 'react-router-redux';
import { takeEvery, call, all, put } from 'redux-saga/effects';
import {
  EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries, IHpTimeSeriesChartState,
} from 'time-series-scroller';
// TODO: verify csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig should be exported in time-series-scroller
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';

import { anomaliesScreenActionTypes } from '../action-creators';
import { IDataGridState } from '../controls/data-grid/state';
import { requests } from '../../requests';
import { IAnomaliesCharts } from '../../anomalies-screen/store-creator';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { IProject } from '../../models';


function* getAnomaliesForChannel(action: any) {
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

    const supportingChannelsParseResults: Papa.ParseResult[] = [];
    const sourceTimeSeries: IExternalSourceTimeSeries[] = [];

    sourceTimeSeries.push({
      color: 'steelblue',
      name: 'raw',
      points: csvLoadingCalculations.extractUnixTimePoints(rawChannelParseResult.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries);

    sourceTimeSeries.push({
      color: 'red',
      name: 'anomalies',
      points: csvLoadingCalculations.extractUnixTimePoints(fixedAnomaliesParseResult.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Dots,
    } as IExternalSourceTimeSeries);

    let newChartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource(sourceTimeSeries) as IHpTimeSeriesChartState;

    let editedChartState;
    if (editedChannelParseResult.errors.length === 0) {
      editedChartState =
        hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
          color: 'steelblue',
          name: 'final',
          points: csvLoadingCalculations.extractUnixTimePoints(editedChannelParseResult.data, {
            rawFormat: EnumRawCsvFormat.DateTimeThenValue,
            timeStampColumnName: 'time',
            valueColumnName: 'value',
          } as IExtractUnixTimePointsConfig),
          type: EnumTimeSeriesType.Line,
        } as IExternalSourceTimeSeries]);
    } else {
      editedChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
    }

    // check if this is necessary
    editedChartState.dateRangeUnixFrom = newChartState.dateRangeUnixFrom;
    editedChartState.dateRangeUnixTo = newChartState.dateRangeUnixTo;
    editedChartState.windowUnixFrom = newChartState.windowUnixFrom;
    editedChartState.windowUnixTo = newChartState.windowUnixTo;

    let supportingChannelsResults: any[] = [];
    if (project.supportingChannels.length > 0) {
      supportingChannelsResults = yield requests.getSupportingChannels(project.supportingChannels, startDate, endDate);
    }
    yield put(_.toPlainObject(new HideModalAction()));

    const supportingChannels = _.map(project.supportingChannels, (el, idx) => {
      const supportingChannelParseResult = Papa.parse(supportingChannelsResults[idx].data, { header: true });
      let chartState: IHpTimeSeriesChartState;

      if (supportingChannelParseResult.errors.length === 0) {
        chartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
          color: 'steelblue',
          name: el.site + ' ' + el.channel,
          points: csvLoadingCalculations.extractUnixTimePoints(supportingChannelParseResult.data, {
            rawFormat: EnumRawCsvFormat.DateTimeThenValue,
            timeStampColumnName: 'time',
            valueColumnName: 'value',
          } as IExtractUnixTimePointsConfig),
          type: EnumTimeSeriesType.Line,
        } as IExternalSourceTimeSeries])
      } else {
        chartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
      }

      // consider if this is necessary

      chartState.dateRangeUnixFrom = newChartState.dateRangeUnixFrom;
      chartState.dateRangeUnixTo = newChartState.dateRangeUnixTo;
      chartState.windowUnixFrom = newChartState.windowUnixFrom;
      chartState.windowUnixTo = newChartState.windowUnixTo;

      supportingChannelsParseResults.push(supportingChannelParseResult);
      
      return {
        site: el.site,
        channel: el.channel,
        chartState,
      };
    });

    if(_.isUndefined(newChartState.yMax) && _.isUndefined(newChartState.yMin)) {
      newChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
    }

    if(editedChartState.yMax === 0 && editedChartState.yMin === 0) {
      editedChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
    }

    yield put({
      // TODO: fix the payload
      type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED, payload: {
        mainChartState: newChartState,
        finalChartState: editedChartState,
        supportingChannels,
        lastStartDate: startDate,
        lastEndDate: endDate,
      },
    });
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_GRID_FULFILED, payload: newGridState });

  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_REJECTED, payload: error.message });
  }
}

export function* watchGetAnomaliesForChannel() {
  yield takeEvery(anomaliesScreenActionTypes.GET_ANOMALIES_START, getAnomaliesForChannel);
}