import axios from 'axios';
import { call } from 'redux-saga/effects'
import _ = require('lodash');

export class Requests {

    private static apiAddress = 'http://flowworks-http.13.91.222.33.xip.io'; // this is only for testing purposes 13.91.93.221:8080/config/anomaly-tool
    
    static* getConfiguration(): any {
        let config: any;

        try{
            config = yield call(axios.get, `${this.apiAddress}/config/anomaly-tool`);
        }
        catch(error) {
            config = { data: [ {id: 'someId', data: { name: 'someName' }} ]};
        }
        
        return config;
    }

    static* getRawChannelData() {
        let channelData: any;
        
        try {
            channelData = yield call(axios.get, `${this.apiAddress}/data/channel/7880-11732/data?startDate=2017-06-01&endDate=2017-06-30`);
        }
        catch(error) {
            channelData = { };
        }

        return channelData;
    }

    static* getFixedAnomalies() {
        let anomalies: any;

        try {
            anomalies = yield call(axios.get, `${this.apiAddress}/anomalies/find?series=7880-11732&startDate=2017-06-01&endDate=2017-06-31`);
        }
        catch(error) {
            anomalies = { };
        }

        return anomalies;
    }

    static* getEditedChannelData() {
        let channelData: any;
        
        try {
            channelData = yield call(axios.get, `${this.apiAddress}/data/channel/7880-11734/data?startDate=2017-06-01&endDate=2017-06-30`);
        }
        catch(error) {
            channelData = { };
        }

        return channelData;
    }
}