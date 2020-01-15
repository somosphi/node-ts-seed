import { expect, sinon, assert } from '../../helpers';
import { RabbitMQ, RabbitMQConfig } from '../../../src/amqp/vhosts';
import { RabbitMQConsumer } from '../../../src/amqp/rabbitmq-consumer';
import { Container } from '../../../src/container';
import { Consumer } from '../../../src/amqp/consumers/consumer';

export class HomeVHost extends RabbitMQ implements RabbitMQConsumer {
  container?: Container;
  consumers: Consumer[] = [];

  constructor(vHost: string, config: RabbitMQConfig, container?: Container) {
    super(vHost, config);
    this.container = container;
  }

  loadConsumers(): void {}

  startConsumers(container: Container): void {}
}

describe('RabbitMQ', () => {
  describe('', () => {
    const config: RabbitMQConfig = {
      protocol: '123',
      host: '123',
      port: 123,
      username: 'user',
      password: 'pass',
    }
    const homeVhost = new HomeVHost('home', config);
  });
});
