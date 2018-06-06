import * as _ from 'lodash';
import * as Papa from 'papaparse';
import axios from 'axios';
import { push } from 'react-router-redux';
import { takeEvery, call } from 'redux-saga/effects';
import { all, put } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from './action-creators';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import {
  EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries, IHpTimeSeriesChartState,
} from 'time-series-scroller';
import { IDataGridState } from './controls/data-grid/state';
import { Requests } from '../requests';
import { IProject } from '../projects-screen/state';
import { IAnomaliesCharts } from '../anomalies-screen/store-creator';
import * as dateFns from 'date-fns';
import { ParseResult } from 'papaparse';
import { ISite } from '../model';

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function* () { yield put(push('/projects')); });
}

function* getAnomaliesForChannel(action: any) {

  const project: IProject = action.payload.project;
  const startDate: string = action.payload.startDate;
  const endDate: string = action.payload.endDate;

  try {
    const rawChannelResponse = yield Requests.getChannelData(`${project.site}-${project.raw}`, startDate, endDate);
    const fixedAnomaliesResponse = yield Requests.getFixedAnomalies(`${project.site}-${project.raw}`, startDate, endDate);
    const editedChannelResponse = yield Requests.getChannelData(`${project.site}-${project.raw}`, startDate, endDate);

    const rawChannelParseResult = Papa.parse(rawChannelResponse.data, { header: true });
    const fixedAnomaliesParseResult = Papa.parse(fixedAnomaliesResponse.data, { header: true });
    const editedChannelParseResult = Papa.parse(editedChannelResponse.data, { header: true });
    const supportingChannelsParseResults: ParseResult[] = [];

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

    const newChartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource(sourceTimeSeries) as IHpTimeSeriesChartState;

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
        extendedValue2: _.size(supportingChannelsValuesMap) > 0 ?
          supportingChannelsValuesMap[1].has(timeKey) ? supportingChannelsValuesMap[1].get(timeKey) : null
          : null,
      });
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

function* copyRawToEdited() {
  yield put({ type: anomaliesScreenActionTypes.COPY_RAW_TO_EDITED, payload: '' });
}

export function* watchCopyRawToEdited() {
  yield takeEvery(anomaliesScreenActionTypes.COPY_RAW_TO_EDITED, copyRawToEdited);
}


function* addAndPopulateChannel(action: any) {
  try {
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FETCHING })

    let site: string = action.payload.siteChannelInfo.site;
    let channel: string = action.payload.siteChannelInfo.channel;
    let startDate: string = action.payload.startDate;
    let endDate: string = action.payload.endDate;

    const channelData = yield Requests.getChannelData(site + '-' + channel, startDate, endDate);
    const channelParseResult = Papa.parse(channelData.data, { header: true });

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
          type: EnumTimeSeriesType.Line
        } as IExternalSourceTimeSeries]);
    } else {
      channelChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
      channelChartState.dateRangeUnixFrom = dateFns.parse(startDate).getMilliseconds();
      channelChartState.dateRangeUnixTo = dateFns.parse(endDate).getMilliseconds();
    }

    yield put({
      type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILED, payload: {
        siteChannelInfo: action.payload.siteChannelInfo,
        channelChartState: channelChartState,
      }
    })

  }
  catch (error) {
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_REJECTED, payload: error })
  }
}

function* getSitesForProject() {
  try {
    // yield put({ type: anomaliesScreenActionTypes.GET_SITE_IDS_FETCHING });
    const sites: ISite[] = yield Requests.getSites('');

    sites.push({ id: '1', name: 'Site1'});
    sites.push({ id: '2', name: 'Site2'});

    yield put({ type: anomaliesScreenActionTypes.GET_SITE_IDS_FULFILED, payload: { sites } });
  } catch (error) {
    //
  }
}

export function* watchGetSitesForProjectAnomaliesScreen() {
  yield takeEvery(anomaliesScreenActionTypes.GET_SITE_IDS_START, getSitesForProject);
}

export function* watchAddAndPopulateChannel() {
  yield takeEvery(anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_START, addAndPopulateChannel);
}

function* addEmptyChannel(action: any) {
  yield put({ type: anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL, payload: action.payload });
}

export function* watchAddEmptyChannel() {
  yield takeEvery(anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL_START, addEmptyChannel);
}

function* deleteSupportingChannel(action) {
  yield put({ type: anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL, payload: action.payload });
}

export function* watchDeleteSupportingChannel() {
  yield takeEvery(anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL_START, deleteSupportingChannel)
}

function* saveProject(action) {
  yield put({ type: anomaliesScreenActionTypes.SAVE_PROJECT_FETCHING });
  try {
    yield Requests.saveProject(action.payload);
    yield put({ type: anomaliesScreenActionTypes.SAVE_PROJECT_FULFILED });
  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.SAVE_PROJECT_REJECTED });
  }
}

export function* watchSaveProject() {
  yield takeEvery(anomaliesScreenActionTypes.SAVE_PROJECT_START, saveProject);
}