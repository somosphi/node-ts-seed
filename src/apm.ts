import dotenv from 'dotenv';
import elasticApmNode from 'elastic-apm-node';
import { logger } from './logger';

dotenv.config();

if (process.env.APM_SERVICE_NAME && process.env.APM_SERVER_URL) {
  const options = {
    serviceName: process.env.APM_SERVICE_NAME,
    serverUrl: process.env.APM_SERVER_URL,
  };
  elasticApmNode.start(options);
  logger.info('Registered in APM Server', options);
}
