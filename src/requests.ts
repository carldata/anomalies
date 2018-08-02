import axios, { AxiosResponse, AxiosPromise } from 'axios';
import * as _ from 'lodash';
import { all, call, select } from 'redux-saga/effects';
import { IProject, IChannel, ISite } from './models';

const appName = 'anomaly-tool-development';
// const apiAddress = 'http://13.77.168.238';
const apiAddress = 'http://localhost:8080';
let token = '';

enum EnumHTTPVerb { GET, POST, PUT, DELETE }

export interface IConfigurationEntry {
  id: string;
  data: IProject;
}

const httpOp = <TReturnedDataType>(verb: EnumHTTPVerb, url: string, payload?: any): AxiosPromise<TReturnedDataType> => {
  const enpointCall = () => {
    switch (verb) {
      case EnumHTTPVerb.GET:
        return axios.get<AxiosResponse<TReturnedDataType>>(url);
      case EnumHTTPVerb.POST:
        return axios.post<AxiosResponse<TReturnedDataType>>(url, payload);
      case EnumHTTPVerb.PUT:
        return axios.put<AxiosResponse<TReturnedDataType>>(url, payload);
      case EnumHTTPVerb.DELETE:
        return axios.delete(url);
    }
  };
  return new Promise((resolve, reject) =>
    enpointCall()
      .then((response) => resolve(response.data))
      .catch((error) => reject(error)));
};

const getConfiguration = (): AxiosPromise<IConfigurationEntry[]> => {
  const configuration = select((state) => state);
  return httpOp<IConfigurationEntry[]>(EnumHTTPVerb.GET, `${apiAddress}/config/${appName}`);
};

const getChannelData = (channel: string, startDate: string, endDate: string): AxiosPromise<string> =>
  httpOp<string>(EnumHTTPVerb.GET, `${apiAddress}/data/channel/${channel}/data?startDate=${startDate}&endDate=${endDate}`);

const getFixedAnomalies = (finalChannel: string, rawChannel: string, startDate: string, endDate: string): AxiosPromise<string> =>
  httpOp<string>(EnumHTTPVerb.GET,
    `${apiAddress}/anomalies/find?editedFlowChannelId=${finalChannel}&rawFlowChannelId=${rawChannel}&startDate=${startDate}&endDate=${endDate}&token=${token}`);

const getSupportingChannels = (supportingChannels: { siteId: string, channelId: string }[], startDate: string, endDate: string): Promise<AxiosResponse<string>[]> =>
  Promise.all(_.map(supportingChannels, (el) => {
    return httpOp<string>(EnumHTTPVerb.GET, `${apiAddress}/data/channel/${el.siteId}-${el.channelId}/data?startDate=${startDate}&endDate=${endDate}`);
  }));

const addProject = (project: IProject): AxiosPromise<string> =>
  httpOp<string>(EnumHTTPVerb.POST, `${apiAddress}/config/${appName}`, JSON.stringify(project));

const deleteProject = (projectId: string): AxiosPromise<string> =>
  httpOp<string>(EnumHTTPVerb.DELETE, `${apiAddress}/config/${appName}/${projectId}`);

const saveProject = (project: IProject): AxiosPromise<string> =>
  httpOp<string>(EnumHTTPVerb.PUT, `${apiAddress}/config/${appName}/${project.id}`, JSON.stringify(project));

const getSites = (db: string): AxiosPromise<ISite[]> =>
  httpOp<ISite[]>(EnumHTTPVerb.GET, `${apiAddress}/data/site/${db}?token=${token}`);

const getChannels = (siteId: string): AxiosPromise<IChannel[]> =>
  httpOp<IChannel[]>(EnumHTTPVerb.GET, `${apiAddress}/data/channel/${siteId}?token=${token}`);

export const requests = (t: string = 'oasdob123a23hnaovnfaewd123akjwpod') => {
  token = t;
  return {
    getConfiguration,
    getChannelData,
    getFixedAnomalies,
    getSupportingChannels,
    addProject,
    deleteProject,
    saveProject,
    getSites,
    getChannels,
  };
};
