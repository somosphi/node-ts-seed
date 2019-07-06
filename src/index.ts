import knex from 'knex';
import * as dotenv from 'dotenv';
import { Container } from './container';
import { Worker } from './worker';

dotenv.config();

const knexfile = require('../knexfile');

setImmediate(async () => {
  const mysqlDatabase = knex(knexfile);

  const container = new Container(mysqlDatabase, {
    jsonPlaceholderConfig: {
      baseURL: process.env.JSON_PLACEHOLDER_URL || '',
    },
  });

  const worker = new Worker(container);

  worker.start();
});
