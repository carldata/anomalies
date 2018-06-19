import axios, { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import { all, call } from 'redux-saga/effects';
import { IProject, IChannel, ISite } from './models';

const appName = 'anomaly-tool';
const apiAddress = 'http://13.77.168.238';
const token = 'oasdob123a23hnaovnfaewd123akjwpod';

const getConfiguration = async (): Promise<IProject[]> => {
  try {
    const response: AxiosResponse<IProject[]> = await axios.get<IProject[]>(`${apiAddress}/config/${appName}`);
    if (_.isObject(response)) {
      return response.data;
    }
    return [];
  } catch (error) {
    //TODO notify error
  }
  return [];
};

function *getChannelData(channel: string, startDate: string, endDate: string) {
  let channelData: any;

  try {
    // TODO when data endpoint starts to work use it instead of anomalies endpoint
    channelData = yield call(axios.get, `${apiAddress}/data/channel/${channel}/data?startDate=${startDate}&endDate=${endDate}`);
    //channelData = yield call(axios.get, `${apiAddress}/anomalies/find?series=${channel}&startDate=${startDate}&endDate=${endDate}`);

  }
  catch (error) {
    //TODO notify error
    channelData = {};
  }
  return channelData;
}

function *getFixedAnomalies(channel: string, startDate: string, endDate: string) {
    let anomalies: any;

    try {
      anomalies = yield call(axios.get, `${apiAddress}/anomalies/find?series=${channel}&startDate=${startDate}&endDate=${endDate}`);
    }
    catch (error) {
      //TODO notify error
      anomalies = {};
    }

    return anomalies;
  }

//TODO - remove  getEditedChannelData and use only getChannelData
function *getEditedChannelData(channel: string, startDate: string, endDate: string) {
  let channelData: any;
  try {
    channelData = yield call(axios.get, `${apiAddress}/data/channel/${channel}/data?startDate=${startDate}&endDate=${endDate}`);
  }
  catch (error) {
    //TODO notify error
    channelData = {};
  }
  return channelData;
}

function *getSupportingChannels(supportingChannels: Array<{ site: string, channel: string }>, startDate: string, endDate: string) {
  let supportingChannelsResult: any[] = [];

  // TODO - change this to get data for channels instead of anomalies when endpoint starts to work
  try {
    supportingChannelsResult = yield all(_.map(supportingChannels, (el) =>
      call(axios.get, `${apiAddress}/data/channel/${el.site}-${el.channel}/data?startDate=${startDate}&endDate=${endDate}`)));
  } catch (error) {
    // TODO throw error
  }

  return supportingChannelsResult;
}

function *addProject(project: IProject) {
  let projectId: string = '';
  try {
    let response = yield call(axios.post,
      `${apiAddress}/config/${appName}`,
      JSON.stringify(project));
    projectId = response.data;
  } catch (error) {
    // TODO notify error
  }
  return projectId;
}

function *saveProject(project: IProject) {
  let projectId;
  try {
    let response = yield call(axios.put,
      `${apiAddress}/config/${appName}/${project.id}`,
      JSON.stringify(project),
    );
    projectId = response.data;
  } catch (error) {
    // TODO throw error
  }
  return projectId;
}

function *getSites(db: string) {
  let sites: ISite[] = [];
  try {
    const response = yield call(axios.get, `${apiAddress}/data/site/${db}?token=${token}`);
    sites = _.map(response.data, (el) => ({ id: el.id, name: el.name } as ISite));
  } catch (error) {
    // TODO throw error
  }
  return sites;
}

function *getChannels(siteId: string) {
  let channels: IChannel[] = [];
  try {
    const response = yield call(axios.get, `${apiAddress}/data/channel/${siteId}?token=${token}`);
    channels = _.map(response.data, (el) => ({ id: el.id, name: el.name } as IChannel));
  } catch (error) {
    // TODO throw error
  }
  return channels;
}

export const requests = {
  getConfiguration,
  getChannelData,
  getFixedAnomalies,
  getEditedChannelData,
  getSupportingChannels,
  addProject,
  saveProject,
  getSites,
  getChannels,
};
