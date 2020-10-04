import amqplib, { Options, Channel, Connection, ConfirmChannel } from 'amqplib';
import { logger } from '../../logger';
import { BufferConverter } from '../buffer-converter';
import { AppContainer } from '../../container';

export interface RabbitMQConfig {
  protocol: string;
  host: string;
  port: number;
  username: string;
  password: string;
  consumerPrefetch: number;
  producerPrefetch: number;
}

export type InitOptions = {
  startConsumers: boolean;
  startProducers: boolean;
};

export abstract class RabbitMQ {
  protected connection!: Connection;

  protected producerChannel!: ConfirmChannel;

  protected consumerChannel!: Channel;

  protected readonly config: RabbitMQConfig;

  readonly vHost: string;

  protected initOptions?: InitOptions;

  protected defaultInitOptions = {
    startConsumers: true,
    startProducers: true,
  };

  constructor(vHost: string, config: RabbitMQConfig) {
    this.config = config;
    this.vHost = vHost;
  }

  startConsumers(container: AppContainer): void {}

  async init(
    container: AppContainer,
    initOptions: InitOptions = this.defaultInitOptions
  ): Promise<void> {
    this.initOptions = initOptions;

    try {
      this.connection = await amqplib.connect(this.connectionConfig());
      logger.info(`RabbitMQ connection established on vhost - ${this.vHost}
        `);
      this.handleOnError(container);

      if (initOptions.startProducers) {
        this.producerChannel = await this.connection.createConfirmChannel();
        this.producerChannel.prefetch(this.config.producerPrefetch);
      }

      if (initOptions.startConsumers) {
        this.consumerChannel = await this.connection.createChannel();
        this.consumerChannel.prefetch(this.config.consumerPrefetch);
        this.startConsumers(container);
      }
    } catch (err) {
      logger.error(
        `Error connecting RabbitMQ to virtual host ${this.vHost} : ${err}`
      );
      this.reconnect(container);
    }
  }

  async send(
    exchange: string,
    routingKey: string,
    message: object,
    additionalParams?: Options.Publish
  ): Promise<void> {
    try {
      await this.publish(
        exchange || '',
        routingKey,
        BufferConverter.converter(message),
        additionalParams
      );
    } catch (err) {
      throw Error(`Error Posting Message to RabbitMQ Server - cause ${err}`);
    }
  }

  protected async publish(
    exchange: string,
    routingKey: string,
    message: Buffer,
    options?: Options.Publish
  ) {
    return new Promise((resolve, reject) => {
      this.producerChannel.publish(
        exchange,
        routingKey,
        message,
        options,
        (err, ok) => {
          err ? reject(err) : resolve(ok);
        }
      );
    });
  }

  protected connectionConfig(): Options.Connect {
    return {
      hostname: this.config.host,
      username: this.config.username,
      password: this.config.password,
      protocol: this.config.protocol,
      port: this.config.port,
      vhost: this.vHost,
    };
  }

  protected handleOnError(container: AppContainer) {
    this.connection.on('blocked', reason => {
      logger.error(`Connection blocked because of ${reason}`);
    });
    this.connection.on('close', () => this.reconnect(container));
    this.connection.on('error', () => this.reconnect(container));
  }

  protected reconnect(container: AppContainer): void {
    logger.warn(
      `Trying to connect to rabbitmq on virtual host ${this.vHost} in 5 seconds`
    );
    setTimeout(() => {
      this.init(container, this.initOptions);
    }, 5000);
  }
}
