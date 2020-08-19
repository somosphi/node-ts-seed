import { ConsumeMessage, Channel, Message } from 'amqplib';
import { AppContainer } from '../../container';
import { logger } from '../../logger';

export abstract class Consumer {
  constructor(
    readonly queue: string,
    protected readonly container: AppContainer
  ) {}

  abstract messageHandler(message: ConsumeMessage | null): void;

  onConsume(channel: Channel) {
    return (message: Message | null): void => {
      try {
        this.messageHandler(message);
      } catch (error) {
        this.onConsumeError(error, channel, message);
        logger.error(error);
      } finally {
        if (message) channel.ack(message);
      }
    };
  }

  onConsumeError(
    err: any,
    channel: Channel,
    message: ConsumeMessage | null
  ): void {}
}
