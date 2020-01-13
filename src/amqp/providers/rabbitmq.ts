import { Options, Channel, Connection, connect } from "amqplib";
import { logger } from "../../logger";

export interface RabbitMQConfig {
  rabbitMQProtocol: string;
  rabbitMQHost: string;
  rabbitMQPort: number;
  rabbitMQUsername: string;
  rabbitMQPassword: string;
}

export abstract class RabbitMQ {
  protected connection!: Connection;
  protected channel!: Channel;
  protected readonly config: RabbitMQConfig;
  protected readonly vHost: string;

  constructor(vHost: string, config: RabbitMQConfig) {
    this.config = config;
    this.vHost = vHost;
  }

  async init() {
    try {
      this.connection = await connect(this.connectionConfig());
      logger.info(`RabbitMQ connection established on vhost - ${this.vHost}
      `);
      this.connection.on("close", () => this.reconnect());
    } catch (err) {
      logger.error(
        `Error connecting RabbitMQ to virtual host ${this.vHost} : ${err}`
      );
    }
  }

  private connectionConfig(): Options.Connect {
    return {
      hostname: this.config.rabbitMQHost,
      username: this.config.rabbitMQUsername,
      password: this.config.rabbitMQPassword,
      protocol: this.config.rabbitMQProtocol,
      port: this.config.rabbitMQPort,
      vhost: this.vHost
    };
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }

  async reconnect() {
    delete this.channel;
    delete this.connectionç;
  }
}
