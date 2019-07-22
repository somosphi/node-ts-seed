import * as dotenv from 'dotenv';
import { logger } from './logger';
import { Application } from './app';

dotenv.config();

const knexfile = require('../knexfile');

const application = new Application({
  knexConfig: knexfile,
  apmServiceName: process.env.APM_SERVICE_NAME || undefined,
  apmServerUrl: process.env.APM_SERVER_URL || undefined,
  httpPort: (process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT, 10)) || 3000,
  httpBodyLimit: process.env.HTTP_BODY_LIMIT || '10kb',
  jsonPlaceholderUrl: process.env.JSON_PLACEHOLDER_URL || 'https://jsonplaceholder.typicode.com',
});

setImmediate(async () => {
  await application.start();
  logger.info('Application started');
});
