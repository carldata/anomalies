import axios from 'axios';
import { call } from 'redux-saga/effects'
import _ = require('lodash');

export class Requests {

    private static apiAddress = 'http://flowworks-http.13.91.222.33.xip.io'; 

    static * getConfiguration(): any {
        let config: any;

        try {
            config = yield call(axios.get, `${this.apiAddress}/config/anomaly-tool`);
        }
        catch (error) {
            //TODO notify error
            config = { data: [{ id: 'someId', data: { name: 'someName' } }] };
        }

        return config;
    }

    static * getChannelData(channel: string, startDate: string, endDate: string) {
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

    static * getEditedChannelData(channel: string, startDate: string, endDate: string) {
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

    static * addProject(data) {
        let projectId: string = '';

        try {
            let response = yield call(axios.post, `${this.apiAddress}/config/anomaly-tool`, {
                name: data.name,
                site: data.site,
                final: data.final,
                raw: data.raw,
            });
            projectId = response.data;
        }
        catch (error) {
            //TODO notify error
        }

        return projectId;
    }
}