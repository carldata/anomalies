import express from 'express';
import fs from 'fs';
import _ from 'lodash';
import { returnMockedJSON } from '../auxiliary';
import { IConfigurationEntry } from '../../requests';

let cache: IConfigurationEntry[] = [];

const sendResponse = (res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(cache);
};
export const handleConfigGet = (req: express.Request, res: express.Response) => {
  console.log('[handleConfigGet] cache size:', _.size(cache));
  if (_.isEmpty(cache)) {
    fs.readFile('assets/config.json', (err, buffer) => {
      cache = _.isObject(buffer) ? JSON.parse(buffer.toString()) : {};
      sendResponse(res);
    });
  } else {
    sendResponse(res);
  }
};