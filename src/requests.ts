import axios, { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import { all, call } from 'redux-saga/effects';
import { IProject, ISite, IChannel } from './models';

export class Requests {
  static appName = 'anomaly-tool';
  static apiAddress = 'http://13.77.168.238';
  static token = 'oasdob123a23hnaovnfaewd123akjwpod';

  static async getConfiguration(): Promise<IProject[]> {
    try {
      const response: AxiosResponse<IProject[]> = await axios.get<IProject[]>(`${this.apiAddress}/config/${this.appName}`);
      if (_.isObject(response)) {
        return response.data;
      }
      return [];
    } catch (error) {
      //TODO notify error
    }
    return [];
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

  public static * getSupportingChannels(supportingChannels: Array<{ site: string, channel: string }>, startDate: string, endDate: string) {
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

  public static * addProject(project: IProject) {
    let projectId: string = '';
    try {
      let response = yield call(axios.post,
        `${this.apiAddress}/config/${this.appName}`,
        JSON.stringify(project));
      projectId = response.data;
    } catch (error) {
      // TODO notify error
    }
    return projectId;
  }

  public static * saveProject(project: IProject) {
    let projectId;
    try {
      let response = yield call(axios.put,
        `${this.apiAddress}/config/${this.appName}/${project.id}`,
        JSON.stringify(project),
      );
      projectId = response.data;
    } catch (error) {
      // TODO throw error
    }
    return projectId;
  }

  public static * getSites(db: string) {
    let sites: ISite[] = [];
    try {
      const response = yield call(axios.get, `${this.apiAddress}/data/site/${db}?token=${this.token}`);
      sites = _.map(response.data, (el) => ({ id: el.id, name: el.name } as ISite));
    } catch (error) {
      // TODO throw error
    }
    return sites;
  }

  public static * getChannels(siteId: string) {
    let channels: IChannel[] = [];
    try {
      const response = yield call(axios.get, `${this.apiAddress}/data/channel/${siteId}?token=${this.token}`);
      channels = _.map(response.data, (el) => ({ id: el.id, name: el.name } as IChannel));
    } catch (error) {
      // TODO throw error
    }
    return channels;
  }
}