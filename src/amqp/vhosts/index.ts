import amqplib, { Options, Channel, Connection } from 'amqplib';
import { logger } from '../../logger';
import { BufferConverter } from '../buffer-converter';
import { RabbitMQConfig } from '../../types';

export abstract class RabbitMQ {
  protected connection!: Connection;

  protected channel!: Channel;

  protected readonly config: RabbitMQConfig;

  readonly vHost: string;

  constructor(vHost: string, config: RabbitMQConfig) {
    this.config = config;
    this.vHost = vHost;
  }

  async init(): Promise<void> {
    try {
      this.connection = await amqplib.connect(this.connectionConfig());
      logger.info(`RabbitMQ connection established on vhost - ${this.vHost}
        `);
      this.handleOnError();
      this.channel = await this.connection.createChannel();
    } catch (err) {
      logger.error(
        `Error connecting RabbitMQ to virtual host ${this.vHost} : ${err}`
      );
      this.reconnect();
    }
  }

  send(
    exchange: string,
    routingKey: string,
    message: object,
    additionalParams?: Options.Publish
  ): void {
    try {
      this.channel.publish(
        exchange || '',
        routingKey,
        BufferConverter.converter(message),
        additionalParams
      );
    } catch (err) {
      throw Error(`Error Posting Message to RabbitMQ Server - cause ${err}`);
    }
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

  protected handleOnError() {
    this.connection.on('blocked', reason => {
      logger.error(`Connection blocked because of ${reason}`);
    });
    this.connection.on('close', () => this.reconnect());
    this.connection.on('error', () => this.reconnect());
  }

  protected reconnect(): void {
    delete this.channel;
    delete this.connection;
    logger.warn(
      `Trying to connect to rabbitmq on virtual host ${this.vHost} in 5 seconds`
    );
    setTimeout(() => {
      this.init();
    }, 5000);
  }
}
