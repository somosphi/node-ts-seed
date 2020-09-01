import './apm';
import { logger } from './logger';
import { Application } from './app';

const application = new Application();

setImmediate(async () => {
  await application.start();
  logger.info('Application started');
});
