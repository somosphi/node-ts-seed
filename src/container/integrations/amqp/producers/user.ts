import { Producer } from './producer';
import { logger } from '../../../../logger';
import { RabbitMQ } from '../../../../amqp/vhosts';
import { Options } from 'amqplib';

export interface UserMessage {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
}

export class UserProducer implements Producer {
  private readonly exchange: string = 'user.dx';
  private readonly routingKey: string = 'user.create';
  protected readonly vHost: RabbitMQ;

  constructor(vHost: RabbitMQ) {
    this.vHost = vHost;
  }

  send(message: UserMessage): void {
    const optionsConfig: Options.Publish = {
      priority: 0,
      deliveryMode: 2,
      contentEncoding: 'UTF-8',
      contentType: 'application/json',
    };
    try {
      this.vHost.send(this.exchange, this.routingKey, message, optionsConfig);
      logger.info(
        `Sending message to exchange - ${this.exchange} and routingKey - ${this.routingKey}`
      );
    } catch (err) {
      logger.error(`Error sending message to exchange ${this.exchange}
       and routingKey - ${this.routingKey} -> reason: ${err}`);
    }
  }
}
