import axios from 'axios';
import * as Papa from 'papaparse';
import { push } from 'react-router-redux';
import { takeEvery, call } from 'redux-saga/effects';
import { all, put } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from './action-creators';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import {
  EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
  IHpTimeSeriesChartState
} from 'time-series-scroller';
import { IDataGridState } from './controls/data-grid/state';
import _ = require('lodash');
import { Requests } from '../requests';
import { IProject } from '../projects-screen/state';
import { IAnomaliesCharts } from '../anomalies-screen/store-creator';
import * as dateFns from 'date-fns'; 

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function* () { yield put(push('/projects')); });
}

function* getAnomaliesForChannel(action: any) {

  let project: IProject = action.payload.project;
  let startDate: string = action.payload.startDate;
  let endDate: string = action.payload.endDate;

  try {
    const rawChannelResponse = yield Requests.getChannelData(project.site + '-' + project.raw, startDate, endDate);
    const fixedAnomaliesResponse = yield Requests.getFixedAnomalies(project.site + '-' + project.raw, startDate, endDate);
    const editedChannelResponse = yield Requests.getChannelData(project.site + '-' + project.final, startDate, endDate);

    const rawChannel = Papa.parse(rawChannelResponse.data, { header: true });
    const fixedAnomalies = Papa.parse(fixedAnomaliesResponse.data, { header: true });
    const editedChannel = Papa.parse(editedChannelResponse.data, { header: true });

    const sourceTimeSeries: IExternalSourceTimeSeries[] = [];

    sourceTimeSeries.push({
      color: 'steelblue',
      name: 'raw',
      points: csvLoadingCalculations.extractUnixTimePoints(rawChannel.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries);

    sourceTimeSeries.push({
      color: 'red',
      name: 'anomalies',
      points: csvLoadingCalculations.extractUnixTimePoints(fixedAnomalies.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Dots,
    } as IExternalSourceTimeSeries);

    const newChartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource(sourceTimeSeries) as IHpTimeSeriesChartState;

    let editedChartState;
    if (editedChannel.errors.length == 0) {
      editedChartState =
        hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
          color: 'steelblue',
          name: 'final',
          points: csvLoadingCalculations.extractUnixTimePoints(editedChannel.data, {
            rawFormat: EnumRawCsvFormat.DateTimeThenValue,
            timeStampColumnName: 'time',
            valueColumnName: 'value',
          } as IExtractUnixTimePointsConfig),
          type: EnumTimeSeriesType.Line
        } as IExternalSourceTimeSeries]);
    } else {
      editedChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
    }
    //check if this is necessary
    editedChartState.dateRangeUnixFrom = newChartState.dateRangeUnixFrom;
    editedChartState.dateRangeUnixTo = newChartState.dateRangeUnixTo;
    editedChartState.windowUnixFrom = newChartState.windowUnixFrom;
    editedChartState.windowUnixTo = newChartState.windowUnixTo;

    let supportingChannelsResults: any[] = [];
    if (project.supportingChannels.length > 0) {
      supportingChannelsResults = yield Requests.getSupportingChannels(project.supportingChannels, startDate, endDate);
    }

    let supportingChannels = _.map(project.supportingChannels, (el, idx) => {

      let parsedResult = Papa.parse(supportingChannelsResults[idx].data, { header: true });;
      let chartState;

      if (parsedResult.errors.length === 0) {
        chartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
          color: 'steelblue',
          name: el.site + ' ' + el.channel,
          points: csvLoadingCalculations.extractUnixTimePoints(parsedResult.data, {
            rawFormat: EnumRawCsvFormat.DateTimeThenValue,
            timeStampColumnName: 'time',
            valueColumnName: 'value',
          } as IExtractUnixTimePointsConfig),
          type: EnumTimeSeriesType.Line
        } as IExternalSourceTimeSeries])
      } else {
        chartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
      }

      //consider if this is necessary
      chartState.dateRangeUnixFrom = newChartState.dateRangeUnixFrom;
      chartState.dateRangeUnixTo = newChartState.dateRangeUnixTo;
      chartState.windowUnixFrom = newChartState.windowUnixFrom;
      chartState.windowUnixTo = newChartState.windowUnixTo;

      return {
        site: el.site,
        channel: el.channel,
        chartState: chartState,
      };
    });

    var newGridState: IDataGridState = { series: [] };
    for (let i = 0; i < rawChannel.data.length; i++) {

      let fixedValue = _.find(fixedAnomalies.data, x => x.time == rawChannel.data[i].time);
      let editedValue = _.find(editedChannel.data, x => x.time == rawChannel.data[i].time);

      if (_.isUndefined(fixedValue)) {
        fixedValue = '';
      }

      if (_.isUndefined(editedValue)) {
        editedValue = '';
      }

      newGridState.series.push({
        date: rawChannel.data[i].time,
        rawValue: rawChannel.data[i].value,
        fixedValue: fixedValue.value,
        editedValue: editedValue.value
      })
    }

    yield put({
      type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED, payload: {
        mainChartState: newChartState,
        finalChartState: editedChartState,
        supportingChannels: supportingChannels,
        lastStartDate: startDate,
        lastEndDate: endDate,
      } as IAnomaliesCharts
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
    if(channelParseResult.errors.length === 0){
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
    }else{
      channelChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
      channelChartState.dateRangeUnixFrom = dateFns.parse(startDate).getMilliseconds();
      channelChartState.dateRangeUnixTo = dateFns.parse(endDate).getMilliseconds();
    }

    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILED, payload:{
      siteChannelInfo: action.payload.siteChannelInfo,
      channelChartState: channelChartState,
    }})

  }
  catch (error) {
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_REJECTED, payload: error })
  }
}

export function* watchAddAndPopulateChannel() {
  yield takeEvery(anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_START, addAndPopulateChannel);
}

function* addEmptyChannel(action: any) {
  let x = 2;
  console.log('addEmptyChannel - worker saga', action);
  yield put({ type: anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL, payload: action.payload });
}

export function* watchAddEmptyChannel() {
  yield takeEvery(anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL_START, addEmptyChannel);
}

function deleteSupportingChannel(action){
  put(action);
}

export function* watchDeleteSupportingChannel(){
  yield takeEvery(anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL,deleteSupportingChannel)
}