import { inject, provide } from 'injection';
import { Options } from 'amqplib';
import { Producer } from './producer';
import { logger } from '../../../../logger';
import { RabbitMQ } from '../../../../amqp/vhosts';

export interface UserMessage {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
}

@provide()
export class UserProducer implements Producer {
  protected readonly exchange: string = 'user.dx';

  protected readonly routingKey: string = 'user.create';

  constructor(@inject('workVHost') protected readonly vHost: RabbitMQ) {}

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
