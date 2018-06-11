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
import { Requests } from '../../requests';
import { IProject } from '../../models/project';
import { IAnomaliesCharts } from '../../anomalies-screen/store-creator';
import { ShowModalAction, HideModalAction } from '../../components/modal';


function* getAnomaliesForChannel(action: any) {

  const project: IProject = action.payload.project;
  const startDate: string = action.payload.startDate;
  const endDate: string = action.payload.endDate;

  try {
    yield put(_.toPlainObject(new ShowModalAction()));

    const rawChannelResponse = yield Requests.getChannelData(`${project.siteId}-${project.rawChannelId}`, startDate, endDate);
    const fixedAnomaliesResponse = yield Requests.getFixedAnomalies(`${project.siteId}-${project.rawChannelId}`, startDate, endDate);
    const editedChannelResponse = yield Requests.getChannelData(`${project.siteId}-${project.finalChannelId}`, startDate, endDate);

    const rawChannelParseResult = Papa.parse(rawChannelResponse.data, { header: true });
    const fixedAnomaliesParseResult = Papa.parse(fixedAnomaliesResponse.data, { header: true });
    const editedChannelParseResult = Papa.parse(editedChannelResponse.data, { header: true });

    const supportingChannelsParseResults: Papa.ParseResult[] = [];

    const fixedAnomaliesValuesMap: Map<number, number> = _.reduce(
      fixedAnomaliesParseResult.data,
      (acc: Map<number, number>, el) => acc.set(dateFns.parse(el.time).getTime(), el.value),
      new Map<number, number>());
    const editedChannelValuesMap: Map<number, number> =  _.reduce(
      editedChannelParseResult.data,
      (acc: Map<number, number>, el) => acc.set(dateFns.parse(el.time).getTime(), el.value),
      new Map<number, number>());
    const supportingChannelsValuesMap: Array<Map<number, number>> = [];

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
      supportingChannelsResults = yield Requests.getSupportingChannels(project.supportingChannels, startDate, endDate);
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
      supportingChannelsValuesMap.push(
        _.reduce(
          editedChannelParseResult.data,
          (acc: Map<number, number>, el) => acc.set(dateFns.parse(el.time).getTime(), el.value),
          new Map<number, number>()));

      return {
        site: el.site,
        channel: el.channel,
        chartState,
      };
    });

    const newGridState: IDataGridState = { rows: [] };
    for (let i = 0; i < rawChannelParseResult.data.length; i++) {
      const timeKey = dateFns.parse(rawChannelParseResult.data[i].time).getTime();
      newGridState.rows.push({
        date: rawChannelParseResult.data[i].time,
        rawValue: rawChannelParseResult.data[i].value,
        fixedValue: fixedAnomaliesValuesMap.has(timeKey) ? fixedAnomaliesValuesMap.get(timeKey) : null,
        editedValue: editedChannelValuesMap.has(timeKey) ? editedChannelValuesMap.get(timeKey) : null,
        extendedValue1: _.size(supportingChannelsValuesMap) > 0 ?
          supportingChannelsValuesMap[0].has(timeKey) ? supportingChannelsValuesMap[0].get(timeKey) : null
          : null,
        extendedValue2: _.size(supportingChannelsValuesMap) > 1 ?
          supportingChannelsValuesMap[1].has(timeKey) ? supportingChannelsValuesMap[1].get(timeKey) : null
          : null,
      });
    }

    if(_.isUndefined(newChartState.yMax) && _.isUndefined(newChartState.yMin)) {
      newChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
    }

    if(editedChartState.yMax === 0 && editedChartState.yMin === 0) {
      editedChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
    }

    yield put({
      type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED, payload: {
        mainChartState: newChartState,
        finalChartState: editedChartState,
        supportingChannels,
        lastStartDate: startDate,
        lastEndDate: endDate,
      } as IAnomaliesCharts,
    });
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_GRID_FULFILED, payload: newGridState });

  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_REJECTED, payload: error.message });
  }
}

export function* watchGetAnomaliesForChannel() {
  yield takeEvery(anomaliesScreenActionTypes.GET_ANOMALIES_START, getAnomaliesForChannel);
}