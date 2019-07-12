import elasticApmNode from 'elastic-apm-node';
import knex from 'knex';
import { HttpServer } from './http';
import { Container } from './container';
import { Worker } from './worker';
import { logger } from './logger';

export interface AppConfig {
  knexConfig: knex.Config;
  apmServiceName?: string;
  apmServerUrl?: string;
  httpPort: number;
  httpBodyLimit: string;
  jsonPlaceholderUrl: string;
}

export class Application {
  private readonly config: AppConfig;
  private httpServer?: HttpServer;
  private worker?: Worker;

  constructor(config: AppConfig) {
    this.config = config;
  }

  getHttpServer(): HttpServer {
    if (!this.httpServer) {
      throw new Error('Application not started');
    }
    return this.httpServer;
  }

  getWorker() {
    if (!this.worker) {
      throw new Error('Application not started');
    }
    return this.worker;
  }

  async start(): Promise<void> {
    const {
      knexConfig,
      apmServiceName,
      apmServerUrl,
      httpPort,
      httpBodyLimit,
      jsonPlaceholderUrl,
    } = this.config;

    const mysqlDatabase = knex(knexConfig);

    const container = new Container({
      mysqlDatabase,
      jsonPlaceholderConfig: {
        baseURL: jsonPlaceholderUrl,
      },
    });

    if (apmServiceName && apmServerUrl) {
      elasticApmNode.start({
        serviceName: apmServiceName,
        serverUrl: apmServerUrl,
      });

      logger.info(`Registered service "${apmServiceName}" in APM Server`);
    }

    this.httpServer = new HttpServer(container, {
      port: httpPort,
      bodyLimit: httpBodyLimit,
    });

    this.worker = new Worker(container);

    this.httpServer.start();
    logger.info(`Http server started in port ${this.httpServer.port}`);

    this.worker.start();
    logger.info(`Worker started with ${this.worker.jobsCount} job(s)`);
  }
}
