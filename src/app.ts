import knex from 'knex';
import { HttpServer } from './http';
import { Container } from './container';
import { Worker } from './worker';
import { logger } from './logger';
import { Bash } from './bash';

export interface AppConfig {
  knexConfig: knex.Config;
  apmServiceName?: string;
  apmServerUrl?: string;
  httpPort: number;
  httpBodyLimit: string;
  jsonPlaceholderUrl: string;
}

export class Application {
  protected readonly bashFlag = '--bash';
  protected readonly config: AppConfig;
  protected httpServer?: HttpServer;
  protected worker?: Worker;
  protected bash?: Bash;

  constructor(config: AppConfig) {
    this.config = config;
  }

  protected async initBash(container: Container): Promise<Bash> {
    const bash = new Bash(container);
    const bashCommandIndex = process.argv.indexOf(this.bashFlag);
    const signatures = process.argv.slice(bashCommandIndex + 1);

    if (signatures.length) {
      await bash.execute(signatures);
    }

    return bash;
  }

  async start(): Promise<void> {
    const {
      knexConfig,
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

    if (process.argv.includes(this.bashFlag)) {
      this.bash = await this.initBash(container);
      process.exit(0);
    }

    this.worker = new Worker(container);
    this.worker.start();
    logger.info(`Worker started with ${this.worker.jobsCount} job(s)`);

    this.httpServer = new HttpServer(container, {
      port: httpPort,
      bodyLimit: httpBodyLimit,
    });
    this.httpServer.start();
    logger.info(`Http server started in port ${this.httpServer.port}`);
  }
}
