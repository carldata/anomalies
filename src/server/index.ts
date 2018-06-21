// tslint:disable-next-line:no-var-requires
import express from 'express';
import fs from 'fs';
import { returnMockedJSON, returnMockedCsv } from './auxiliary';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/config/:appId', (req, res) => {
  returnMockedJSON(res, 'assets/config.json');
});

app.get('/data/channel/:channelId/data', (req, res) => {
  returnMockedCsv(res, `assets/data-${req.params.channelId}.csv`);
});

app.get('/anomalies/find', (req, res) => {
  returnMockedCsv(res, `assets/find-${req.query.series}.csv`);
});

app.get('/data/site/:siteId', (req, res) => {
  returnMockedJSON(res, 'assets/sites.json');
});

app.get('/data/channel/:channelId', (req, res) => {
  returnMockedJSON(res, 'assets/channels.json');
});

// tslint:disable-next-line:no-console
app.listen(3231, () => console.log('listening on port 3231'));