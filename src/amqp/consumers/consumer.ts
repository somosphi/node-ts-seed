import { RabbitMQ } from '../vhosts';
import { Container } from '../../container';
import { ConsumeMessage, Channel, Message } from 'amqplib';

export abstract class Consumer {
  queue: string;
  protected readonly container: Container;

  constructor(queue: string, container: Container) {
    this.queue = queue;
    this.container = container;
  }

  messageHandler(message: ConsumeMessage | null) {}

  onConsume(channel: Channel) {
    return (message: Message | null) => {
      this.messageHandler(message);
      if (message) channel.ack(message);
    };
  }
}
