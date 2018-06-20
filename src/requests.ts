import axios, { AxiosResponse, AxiosPromise } from 'axios';
import * as _ from 'lodash';
import { all, call } from 'redux-saga/effects';
import { IProject, IChannel, ISite } from './models';

const appName = 'anomaly-tool-development';
const apiAddress = 'http://13.77.168.238';
const token = 'oasdob123a23hnaovnfaewd123akjwpod';

export interface IConfigurationEntry {
  id: string;
  data: IProject;
}

function getConfiguration(): AxiosPromise<IConfigurationEntry[]>  {
  return new Promise((resolve, reject) =>
    axios
      .get<AxiosResponse<IConfigurationEntry[]>>(`${apiAddress}/config/${appName}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error)));
}

function *getChannelData(channel: string, startDate: string, endDate: string) {
  return yield call(axios.get, `${apiAddress}/data/channel/${channel}/data?startDate=${startDate}&endDate=${endDate}`);
}

function *getFixedAnomalies(channel: string, startDate: string, endDate: string) {
  return yield call(axios.get, `${apiAddress}/anomalies/find?series=${channel}&startDate=${startDate}&endDate=${endDate}`);
}

//TODO - remove  getEditedChannelData and use only getChannelData
function *getEditedChannelData(channel: string, startDate: string, endDate: string) {
  return yield call(axios.get, `${apiAddress}/data/channel/${channel}/data?startDate=${startDate}&endDate=${endDate}`);
}

function *getSupportingChannels(supportingChannels: { siteId: string, channelId: string }[], startDate: string, endDate: string) {
  return yield all(_.map(supportingChannels, (el) =>
      call(axios.get, `${apiAddress}/data/channel/${el.siteId}-${el.channelId}/data?startDate=${startDate}&endDate=${endDate}`)));
}

function *addProject(project: IProject) {
  let projectId: string = '';
  const response = yield call(axios.post,
    `${apiAddress}/config/${appName}`,
    JSON.stringify(project));
  return response.data;
}

function *saveProject(project: IProject) {
  const response = yield call(axios.put,
    `${apiAddress}/config/${appName}/${project.id}`,
    JSON.stringify(project),
  );
  return response.data;
}

function *getSites(db: string) {
  const response = yield call(axios.get, `${apiAddress}/data/site/${db}?token=${token}`);
  return _.map(response.data, (el) => ({ id: el.id, name: el.name } as ISite));
}

function *getChannels(siteId: string) {
  const response = yield call(axios.get, `${apiAddress}/data/channel/${siteId}?token=${token}`);
  return _.map(response.data, (el) => ({ id: el.id, name: el.name } as IChannel));
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
