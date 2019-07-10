import knex from 'knex';
import elasticApmNode from 'elastic-apm-node';
import * as dotenv from 'dotenv';
import { Container } from './container';
import { Worker } from './worker';
import { logger } from './logger';
import { HttpServer } from './http';

dotenv.config();

const knexfile = require('../knexfile');

const {
  APM_SERVICE_NAME,
  APM_SERVER_URL,
  HTTP_PORT,
  HTTP_BODY_LIMIT,
  JSON_PLACEHOLDER_URL,
} = process.env;

if (APM_SERVICE_NAME && APM_SERVER_URL) {
  elasticApmNode.start({
    serviceName: APM_SERVICE_NAME,
    serverUrl: APM_SERVER_URL,
  });

  logger.info(`Registered service "${APM_SERVICE_NAME}" in APM Server`);
}

const mysqlDatabase = knex(knexfile);

const container = new Container({
  mysqlDatabase,
  jsonPlaceholderConfig: {
    baseURL: JSON_PLACEHOLDER_URL || '',
  },
});

export const httpServer = new HttpServer(container, {
  port: (HTTP_PORT && parseInt(HTTP_PORT, 10)) || 3000,
  bodyLimit: HTTP_BODY_LIMIT || '10kb',
});

export const worker = new Worker(container);

httpServer.start();
logger.info(`Http server started in port ${httpServer.port}`);

worker.start();
logger.info(`Worker started with ${worker.jobsCount} job(s)`);
