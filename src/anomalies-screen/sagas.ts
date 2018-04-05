import axios from 'axios';
import * as Papa from 'papaparse';
import { push } from 'react-router-redux';
import { takeEvery } from 'redux-saga/effects';
import { put } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from './action-creators';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
  IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState } from './controls/data-grid/state';
import _ = require('lodash');

const apiUrl = 'http://13.91.93.221:8080';

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function*() { yield put(push('/projects')); });
}

function* getAnomaliesForChannel(action: any) {

  try {
    const timeseriesResponse = yield axios.get(`${apiUrl}/data/channel/${action.payload}/data`);
    const anomaliesResponse = yield axios.get(`${apiUrl}/anomalies/find?series=${action.payload}`);
    const parsedTimeseries = Papa.parse(timeseriesResponse.data, { header: true});
    const parsedAnomalies = Papa.parse(anomaliesResponse.data, { header: true});

    const sourceTimeSeries: IExternalSourceTimeSeries[] = [];

    sourceTimeSeries.push({
      color: 'steelblue',
      name: 'raw',
      points: csvLoadingCalculations.extractUnixTimePoints(parsedTimeseries.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries);

    sourceTimeSeries.push({
      color: 'red',
      name: 'anomalies',
      points: csvLoadingCalculations.extractUnixTimePoints(parsedAnomalies.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Dots,
    } as IExternalSourceTimeSeries);

    const newChartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource(sourceTimeSeries) as IHpTimeSeriesChartState;
    var newGridState: IDataGridState = { series: [] };
    for(let i = 0; i < parsedTimeseries.data.length; i++){

      let buffValue = parsedTimeseries.data[i].time;
      let anomalyValue = _.find(parsedAnomalies.data, x => x.time == buffValue);

      if(_.isUndefined(anomalyValue)){
        anomalyValue = '';
      }
      else{
        let asdf = 1+1;
      }

      newGridState.series.push({
        date: parsedTimeseries.data[i].time,
        rawValue: parsedTimeseries.data[i].value,
        anomalyValue: anomalyValue.value,
        editedValue: 4
      })
    }

    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED, payload: newChartState });
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_GRID_FULFILED, payload: newGridState });

  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_REJECTED, payload: error.message });
  }
}

export function* watchGetAnomaliesForChannel() {
  yield takeEvery(anomaliesScreenActionTypes.GET_ANOMALIES_START, getAnomaliesForChannel);
}