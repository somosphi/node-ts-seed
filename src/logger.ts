
import { init } from '@somosphi/logger';
import bformat from 'bunyan-format';
import * as dotenv from 'dotenv';

dotenv.config();

const formatOut = bformat({ outputMode: process.env.LOGGER_BEAUTIFY ? 'short' : 'bunyan' });
const {
  Logger,
  ExpressLogger,
  AxiosLogger,
} = init({
  PROJECT_NAME: 'bff-payly-mobile',
  // @ts-ignore
  LOG_LEVEL: process.env.LOGGER_LEVEL || 'info',
  STREAMS: [{
    stream: formatOut,
  }],
});

export const logger = Logger;
export const expressLogger = ExpressLogger;
export const axiosLogger = AxiosLogger;