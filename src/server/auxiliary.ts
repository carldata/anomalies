import express from 'express';
import fs from 'fs';
import _ from 'lodash';

export const returnMockedJSON = (res: express.Response, path: string) => {
  fs.readFile(path, (err, buffer) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(_.isObject(buffer) ? JSON.parse(buffer.toString()) : {});
  });
};

export const returnMockedCsv = (res: express.Response, path: string) => {
  fs.readFile(path, (err, buffer) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(_.isObject(buffer) ? buffer.toString() : '');
  });
};