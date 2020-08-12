import knex from 'knex';
import { HttpServer } from './http';
import { AppContainer } from './container';
import { Worker } from './worker';
import { logger } from './logger';
import { Bash } from './bash';
import { AMQPServer } from './amqp';
import { RabbitMQConfig } from './amqp/vhosts';
export interface AppConfig {
  knexConfig: knex.Config;
  httpPort: number;
  httpBodyLimit: string;
  jsonPlaceholderUrl: string;
  rabbitMQEnabled: string;
  rabbitMQProtocol: string;
  rabbitMQHost: string;
  rabbitMQPort: number;
  rabbitMQUsername: string;
  rabbitMQPassword: string;
  rabbitMQHomeVHost: string;
  rabbitMQWorkVHost: string;
}

export class Application {
  protected readonly bashFlag = '--bash';
  protected readonly config: AppConfig;
  protected httpServer?: HttpServer;
  protected worker?: Worker;
  protected bash?: Bash;
  protected amqpServer?: AMQPServer;

  constructor(config: AppConfig) {
    this.config = config;
  }

  protected async initBash(container: AppContainer): Promise<Bash> {
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
      rabbitMQEnabled,
      rabbitMQProtocol,
      rabbitMQHost,
      rabbitMQPort,
      rabbitMQUsername,
      rabbitMQPassword,
    } = this.config;

    const mysqlDatabase = knex(knexConfig);

    const rabbitMQConfig: RabbitMQConfig = {
      protocol: rabbitMQProtocol,
      host: rabbitMQHost,
      port: rabbitMQPort,
      username: rabbitMQUsername,
      password: rabbitMQPassword,
    };

    this.amqpServer = new AMQPServer(
      rabbitMQConfig,
      rabbitMQEnabled === 'true'
    );

    await this.amqpServer.start();

    const container = new AppContainer({
      mysqlDatabase,
      jsonPlaceholderConfig: {
        baseURL: jsonPlaceholderUrl,
      },
      homeVHost: this.amqpServer.vhosts.home,
      workVHost: this.amqpServer.vhosts.work,
    });

    this.amqpServer.startAllConsumers(container);

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
