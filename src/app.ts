import knex from "knex";
import { HttpServer } from "./http";
import { Container } from "./container";
import { Worker } from "./worker";
import { logger } from "./logger";
import { Bash } from "./bash";
import { RabbitMQ } from "./amqp/providers/rabbitmq";
import { HomeVHost } from "./amqp/providers/home-vhost";
import { AMQPServer } from "./amqp";

export interface AppConfig {
  knexConfig: knex.Config;
  httpPort: number;
  httpBodyLimit: string;
  jsonPlaceholderUrl: string;
  rabbitMQProtocol: string;
  rabbitMQHost: string;
  rabbitMQPort: number;
  rabbitMQUsername: string;
  rabbitMQPassword: string;
  rabbitMQHomeVHost: string;
  rabbitMQWorkVHost: string;
}

export class Application {
  protected readonly bashFlag = "--bash";
  protected readonly config: AppConfig;
  protected httpServer?: HttpServer;
  protected worker?: Worker;
  protected bash?: Bash;
  protected amqpServer?: AMQPServer;

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
      rabbitMQProtocol,
      rabbitMQHost,
      rabbitMQPort,
      rabbitMQUsername,
      rabbitMQPassword
    } = this.config;

    const mysqlDatabase = knex(knexConfig);

    const container = new Container({
      mysqlDatabase,
      jsonPlaceholderConfig: {
        baseURL: jsonPlaceholderUrl
      }
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
      bodyLimit: httpBodyLimit
    });
    this.httpServer.start();
    logger.info(`Http server started in port ${this.httpServer.port}`);

    this.amqpServer = new AMQPServer({
      rabbitMQProtocol,
      rabbitMQHost,
      rabbitMQPort,
      rabbitMQUsername,
      rabbitMQPassword
    });

    await this.amqpServer.start();
    logger.info(`AMQP server started`);
  }
}
