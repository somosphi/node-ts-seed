import { Options, Channel } from 'amqplib';
import { logger } from '../../../../logger';
import { BufferConverter } from './buffer-converter';

export abstract class Producer {
  protected readonly channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  send(
    exchange: string,
    routingKey: string,
    message: object,
    additionalParams?: Options.Publish
  ) {
    try {
      this.channel.publish(
        exchange || '',
        routingKey,
        BufferConverter.converter(message),
        additionalParams
      );
    } catch (err) {
      logger.error(`Error Posting Message to RabbitMQ Server - cause ${err}`);
    }
  }
}
