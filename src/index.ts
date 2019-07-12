import * as dotenv from 'dotenv';
import { logger } from './logger';
import { Application, AppConfig } from './app';

dotenv.config();

const knexfile = require('../knexfile');

const appConfig: AppConfig = {
  knexConfig: knexfile,
  apmServiceName: process.env.APM_SERVICE_NAME || '',
  apmServerUrl: process.env.APM_SERVER_URL || '',
  httpPort: process.env.HTTP_PORT || '',
  httpBodyLimit: process.env.HTTP_BODY_LIMIT || '10kb',
  jsonPlaceholderUrl: process.env.JSON_PLACEHOLDER_URL || '',
};

const application = new Application(appConfig);

setImmediate(async () => {
  await application.start();
  logger.info('Application started');
});
