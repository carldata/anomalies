import axios from 'axios';
import _ = require('lodash');

export class Requests {

    private static apiAddress = 'http://13.91.93.221:8080'; // this is only for testing purposes 13.91.93.221:8080/config/anomaly-tool

    static* getConfiguration(): any {
        let config: any;
        var aa = 1;
        config = yield axios.get(`${this.apiAddress}/config/anomaly-tool`)
                        .catch(error => { console.log(error); });

        if(_.isUndefined(config)) {
            config = { data: [ {id: 'someId', data: { name: 'someName' }} ]};
        }
        
        return config;
    }

    static* getRawChannelData() {
        let channelData: any;
        // const timeseriesResponse = yield axios.get(`${apiUrl}/data/channel/${action.payload}/data`);
        channelData = yield axios.get(`${this.apiAddress}/data/channel/7880-11732/data?startDate=2017-06-01&endDate=2017-06-30`)
                        .catch(error => { console.log(error); });

        if(_.isUndefined(channelData)) {
            channelData = { };
        }

        return channelData;
    }

    static* getFixedAnomalies() {
        let anomalies: any;
        // const anomaliesResponse = yield axios.get(`${apiUrl}/anomalies/find?series=${action.payload}`);
        anomalies = yield axios.get(`${this.apiAddress}/anomalies/find?series=7880-11732&startDate=2017-06-01&endDate=2017-06-31`)
                    .catch(error => { console.log(error); });

        if(_.isUndefined(anomalies)) {
            anomalies = { };
        }

        return anomalies;
    }

    static* getEditedChannelData() {
        let channelData: any;
        
        channelData = yield axios.get(`${this.apiAddress}/data/channel/7880-11734/data?startDate=2017-06-01&endDate=2017-06-30`)
                        .catch(error => { console.log(error); });

        if(_.isUndefined(channelData)) {
            channelData = { };
        }

        return channelData;
    }
}