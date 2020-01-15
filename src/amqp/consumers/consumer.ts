import { RabbitMQ } from '../vhosts';
import { Container } from '../../container';
import { ConsumeMessage } from 'amqplib';

export abstract class Consumer {
  queue: string;
  protected readonly container: Container;

  constructor(queue: string, container: Container) {
    this.queue = queue;
    this.container = container;
  }

  onConsume(message: ConsumeMessage | null): void {}
}
