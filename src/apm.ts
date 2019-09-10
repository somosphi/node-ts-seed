import dotenv from 'dotenv';
import elasticApmNode from 'elastic-apm-node';
import { logger } from './logger';

dotenv.config()

if (process.env.APM_SERVICE_NAME && process.env.APM_SERVER_URL) {
  elasticApmNode.start({
    serviceName: process.env.APM_SERVICE_NAME,
    serverUrl: process.env.APM_SERVER_URL,
  });
  logger.info(`Registered service "${process.env.APM_SERVICE_NAME}" in APM Server`);
}