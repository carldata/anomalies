import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { IUnixTimePoint } from 'time-series-scroller';
import { IState } from '../../state';
import { IDataGridState } from '../controls/data-grid/state';
import { IAnomaliesTimeSeries } from '../models/anomalies-time-series';

export const gridSelector = createSelector<IState, IAnomaliesTimeSeries, IDataGridState>(
  [(state: IState) => state.anomaliesScreen.timeSeries],
  (timeSeries: IAnomaliesTimeSeries) => {
    const result: IDataGridState = { rows: [] };

    const fixedAnomaliesValuesMap: Map<number, number> = _.reduce(
      timeSeries.fixedAnomaliesSeries,
      (acc: Map<number, number>, el) => acc.set(el.unix, el.value),
      new Map<number, number>());
    const editedChannelValuesMap: Map<number, number> = _.reduce(
      timeSeries.editedChannelSeries,
      (acc: Map<number, number>, el) => acc.set(el.unix, el.value),
      new Map<number, number>());
    const supportingChannelsValuesMap: Map<number, number>[] = _.map(
      timeSeries.supportingChannels,
      (ch) => _.reduce(ch,
                       (acc: Map<number, number>, el) => acc.set(el.unix, el.value),
                       new Map<number, number>()));

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < timeSeries.rawSeries.length; i++) {
      const timeKey = timeSeries.rawSeries[i].unix;
      result.rows.push({
        date: dateFns.format(timeKey, 'YYYY-MM-DD HH:mm:ss'),
        epoch: timeKey,
        rawValue: timeSeries.rawSeries[i].value,
        fixedValue: fixedAnomaliesValuesMap.has(timeKey) ? fixedAnomaliesValuesMap.get(timeKey) : null,
        editedValue: editedChannelValuesMap.has(timeKey) ? editedChannelValuesMap.get(timeKey) : null,
        extendedValue1: _.size(supportingChannelsValuesMap) > 0 ?
          supportingChannelsValuesMap[0].has(timeKey) ? supportingChannelsValuesMap[0].get(timeKey) : null
          : null,
        extendedValue2: _.size(supportingChannelsValuesMap) > 1 ?
          supportingChannelsValuesMap[1].has(timeKey) ? supportingChannelsValuesMap[1].get(timeKey) : null
          : null,
        extendedValue3: _.size(supportingChannelsValuesMap) > 2 ?
          supportingChannelsValuesMap[2].has(timeKey) ? supportingChannelsValuesMap[2].get(timeKey) : null
          : null,
        extendedValue4: _.size(supportingChannelsValuesMap) > 3 ?
          supportingChannelsValuesMap[3].has(timeKey) ? supportingChannelsValuesMap[3].get(timeKey) : null
          : null,
        extendedValue5: _.size(supportingChannelsValuesMap) > 4 ?
          supportingChannelsValuesMap[4].has(timeKey) ? supportingChannelsValuesMap[4].get(timeKey) : null
          : null,
      });
    }
    return result;
  }
);