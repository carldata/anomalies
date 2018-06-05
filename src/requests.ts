import axios from 'axios';
import { all, call } from 'redux-saga/effects'
import _ = require('lodash');
import { channel } from 'redux-saga';
import { watchSaveProject } from './anomalies-screen/sagas';
import { IProject } from './projects-screen/state';

export class Requests {

  static apiAddress = 'http://13.77.168.238';

  static * getConfiguration(): any {
    let config: any;

    try {
      config = yield call(axios.get, `${this.apiAddress}/config/anomaly-tool`);
    } catch (error) {
      //TODO notify error
      config = {
        data: [{
          id: 'someId', data: {
            name: 'someName',
            site: '7880',
            raw: '11732',
            final: '11734',
            supportingChannels: [
              {
                site: '7880',
                channel: '11734',
              },
              {
                site: '7880',
                channel: '11734',
              },
            ],
          }
        }]
      };
    }

    return config;
  }

  static * getChannelData(channel: string, startDate: string, endDate: string) {
    let channelData: any;

    try {
      // TODO when data endpoint starts to work use it instead of anomalies endpoint
      channelData = yield call(axios.get, `${this.apiAddress}/data/channel/${channel}/data?startDate=${startDate}&endDate=${endDate}`);
      //channelData = yield call(axios.get, `${this.apiAddress}/anomalies/find?series=${channel}&startDate=${startDate}&endDate=${endDate}`);

    }
    catch (error) {
      //TODO notify error
      channelData = {};
    }

    return channelData;
  }

  static * getFixedAnomalies(channel: string, startDate: string, endDate: string) {
    let anomalies: any;

    try {
      anomalies = yield call(axios.get, `${this.apiAddress}/anomalies/find?series=${channel}&startDate=${startDate}&endDate=${endDate}`);
    }
    catch (error) {
      //TODO notify error
      anomalies = {};
    }

    return anomalies;
  }

  //TODO - remove  getEditedChannelData and use only getChannelData
  public static * getEditedChannelData(channel: string, startDate: string, endDate: string) {
    let channelData: any;

    try {
      channelData = yield call(axios.get, `${this.apiAddress}/data/channel/${channel}/data?startDate=${startDate}&endDate=${endDate}`);
    }
    catch (error) {
      //TODO notify error
      channelData = {};
    }

    return channelData;
  }

  static * getSupportingChannels(supportingChannels: Array<{ site: string, channel: string }>, startDate: string, endDate: string) {
    let supportingChannelsResult: any[] = [];

    // TODO - change this to get data for channels instead of anomalies when endpoint starts to work
    try {
      supportingChannelsResult = yield all(_.map(supportingChannels, (el) =>
        call(axios.get, `${this.apiAddress}/data/channel/${el.site + '-' + el.channel}/data?startDate=${startDate}&endDate=${endDate}`)));
    } catch (error) {
      // TODO throw error
    }

    return supportingChannelsResult;
  }

  static * addProject(data) {
    let projectId: string = '';

    try {
      let response = yield call(axios.post, `${this.apiAddress}/config/anomaly-tool`, {
        name: data.name,
        site: data.site,
        final: data.final,
        raw: data.raw,
        supportingChannels: [],
      });
      projectId = response.data;
    } catch (error) {
      // TODO notify error
    }

    return projectId;
  }

  static * saveProject(project: IProject) {
    let projectId;
    try {
      let response = yield call(axios.put, `${this.apiAddress}/config/anomaly-tool/${project.id}`, {
        name: project.name,
        site: project.site,
        final: project.final,
        raw: project.raw,
        supportingChannels: _.cloneDeep(project.supportingChannels),
      });
      projectId = response.data;
    } catch (error) {
      // TODO throw error
    }
    return projectId;
  }

  static * getSites(token: string) {
    let sites: number[] = [];
    try {
      let response = yield call(axios.get, `${this.apiAddress}/data/site/FlowMetrix?token=${token}`, {});
      sites = response.data;
    } catch (error) {
      // TODO throw error
    }
    return sites;
  }

  static * getChannels(token: string, siteId: number) {
    let channels: number[] = [];
    try {
      let response = yield call(axios.get, `${this.apiAddress}/data/channel/${siteId}?token=${token}`, {});
      channels = response.data;
    } catch (error) {
      // TODO throw error
    }
    return channels;
  }
}