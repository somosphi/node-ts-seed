import * as amqp from "amqplib";
import { logger } from "../../logger";

export interface RabbitMQConfig {
  rabbitMQProtocol: string;
  rabbitMQHost: string;
  rabbitMQPort: number;
  rabbitMQUsername: string;
  rabbitMQPassword: string;
}

export abstract class RabbitMQ {
  protected connection?: amqp.Connection;
  protected channel?: amqp.Channel;
  protected readonly config: RabbitMQConfig;
  protected readonly vHost: string;

  constructor(vHost: string, config: RabbitMQConfig) {
    this.config = config;
    this.vHost = vHost;
  }

  async start() {
    this.initConnection();
  }

  private async initConnection() {}

  private async initChannel() {}

  private async close() {}
}
