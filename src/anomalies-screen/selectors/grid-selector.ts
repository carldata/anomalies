import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { IUnixTimePoint } from 'time-series-scroller';
import { IState } from '../../state';
import { IDataGridState } from '../controls/data-grid/state';
import { ISupportingChannel } from '../models/supporting-channel';

interface IAnomaliesScreenSourceOfTruth {
  rawSeries: IUnixTimePoint[];
  fixedAnomaliesSeries: IUnixTimePoint[];
  editedChannelSeries: IUnixTimePoint[];
  supportingChannels: ISupportingChannel[];
}

const anomaliesSourceOfTruth = (state: IState) => ({
  rawSeries: state.anomaliesScreen.rawSeries,
  fixedAnomaliesSeries: state.anomaliesScreen.fixedAnomaliesSeries,
  editedChannelSeries: state.anomaliesScreen.editedChannelSeries,
  supportingChannels: state.anomaliesScreen.supportingChannels,
} as IAnomaliesScreenSourceOfTruth);


export const gridSelector = createSelector<IState, IAnomaliesScreenSourceOfTruth, IDataGridState>(
  [anomaliesSourceOfTruth],
  (sourceOfTruth: IAnomaliesScreenSourceOfTruth) => {
    const result: IDataGridState = { rows: [] };

    const fixedAnomaliesValuesMap: Map<number, number> = _.reduce(
      sourceOfTruth.fixedAnomaliesSeries,
      (acc: Map<number, number>, el) => acc.set(el.unix, el.value),
      new Map<number, number>());
    const editedChannelValuesMap: Map<number, number> = _.reduce(
      sourceOfTruth.editedChannelSeries,
      (acc: Map<number, number>, el) => acc.set(el.unix, el.value),
      new Map<number, number>());
    const supportingChannelsValuesMap: Map<number, number>[] = _.map(
      sourceOfTruth.supportingChannels,
      (ch) => _.reduce(ch.timeSeries,
                       (acc: Map<number, number>, el) => acc.set(el.unix, el.value),
                       new Map<number, number>()));

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < sourceOfTruth.rawSeries.length; i++) {
      const timeKey = sourceOfTruth.rawSeries[i].unix;
      result.rows.push({
        date: dateFns.format(timeKey, 'YYYY-MM-DD HH:mm:ss'),
        rawValue: sourceOfTruth.rawSeries[i].value,
        fixedValue: fixedAnomaliesValuesMap.has(timeKey) ? fixedAnomaliesValuesMap.get(timeKey) : null,
        editedValue: editedChannelValuesMap.has(timeKey) ? editedChannelValuesMap.get(timeKey) : null,
        extendedValue1: _.size(supportingChannelsValuesMap) > 0 ?
          supportingChannelsValuesMap[0].has(timeKey) ? supportingChannelsValuesMap[0].get(timeKey) : null
          : null,
        extendedValue2: _.size(supportingChannelsValuesMap) > 1 ?
          supportingChannelsValuesMap[1].has(timeKey) ? supportingChannelsValuesMap[1].get(timeKey) : null
          : null,
        extendedValue3: _.size(supportingChannelsValuesMap) > 1 ?
          supportingChannelsValuesMap[2].has(timeKey) ? supportingChannelsValuesMap[2].get(timeKey) : null
          : null,
        extendedValue4: _.size(supportingChannelsValuesMap) > 1 ?
          supportingChannelsValuesMap[3].has(timeKey) ? supportingChannelsValuesMap[3].get(timeKey) : null
          : null,
        extendedValue5: _.size(supportingChannelsValuesMap) > 1 ?
          supportingChannelsValuesMap[4].has(timeKey) ? supportingChannelsValuesMap[4].get(timeKey) : null
          : null,
      });
    }

    return result;
  }
);