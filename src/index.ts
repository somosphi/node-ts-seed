import knex from 'knex';
import elasticApmNode from 'elastic-apm-node';
import * as dotenv from 'dotenv';
import { Container } from './container';
import { Worker } from './worker';
import { logger } from './logger';
import { HttpServer } from './http';

dotenv.config();

const knexfile = require('../knexfile');

elasticApmNode.start({
  serviceName: process.env.APM_SERVICE_NAME, // use package.json
  serverUrl: process.env.APM_SERVER_URL,
});

logger.info(`Registered service "${process.env.APM_SERVICE_NAME}" in APM Server`);

const mysqlDatabase = knex(knexfile);

const container = new Container(mysqlDatabase, {
  jsonPlaceholderConfig: {
    baseURL: process.env.JSON_PLACEHOLDER_URL || '',
  },
});

export const httpServer = new HttpServer(container, {
  port: (process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT, 10)) || 3000,
  bodyLimit: process.env.HTTP_BODY_LIMIT || '10kb',
});

export const worker = new Worker(container);

httpServer.start();
logger.info(`Http server started in port ${httpServer.port}`);

worker.start();
logger.info(`Worker started with ${worker.jobsCount} job(s)`);
