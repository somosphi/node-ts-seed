import { RabbitMQ } from '../../../../amqp/vhosts/index';
import { Container } from '../../..';

export abstract class Consumer {
  protected readonly vHost: RabbitMQ;
  protected readonly container: Container;

  constructor(vHost: RabbitMQ, container: Container) {
    this.vHost = vHost;
    this.container = container;
  }
}
