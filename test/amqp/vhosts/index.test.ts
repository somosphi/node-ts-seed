import amqplib, { Options, Channel, Connection } from 'amqplib';
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
  const sandbox = sinon.createSandbox();
  const connection = {
    createChannel: () => {}
  };

  beforeEach(() => {
    sandbox.stub(amqplib, 'connect')
      .callsFake(() => ({test:123}));
  });

  describe('init', () => {
    it('should convert object', () => {
      const config: RabbitMQConfig = {
        protocol: '123',
        host: '123',
        port: 123,
        username: 'user',
        password: 'pass',
      }
      const homeVhost = new HomeVHost('home', config);

      homeVhost.init();
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
