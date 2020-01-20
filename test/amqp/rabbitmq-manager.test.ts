import { sinon } from '../helpers';
import { RabbitMQManager } from '../../src/amqp/rabbitmq-manager';

const sandbox = sinon.createSandbox();
let channel: any;

describe('RabbitMQManager', () => {

  beforeEach(() => {
    channel = {
      bindQueue: sandbox.stub(),
      assertExchange: sandbox.stub(),
      assertQueue: sandbox.stub(),
    };
  });

  describe('bindQueue', () => {
    it('should call channel.bindQueue', async () => {
      // @ts-ignore
      const rabbitMQManager = new RabbitMQManager(channel);
      rabbitMQManager.bindQueue(
        'queueName',
        'routingKeyName',
        'pattern',
        { test: 123 }
      );
      sandbox.assert.calledWith(
        channel.bindQueue,
        'queueName',
        'routingKeyName',
        'pattern',
        { test: 123 }
      );
    });
  });
  describe('createExchange', () => {
    it('should call channel.assertExchange', async () => {
      // @ts-ignore
      const rabbitMQManager = new RabbitMQManager(channel);
      rabbitMQManager.createExchange(
        'exchangeName',
        'type',
        { arguments: 123 },
      );
      sandbox.assert.calledWith(
        channel.assertExchange,
        'exchangeName',
        'type',
        { arguments: 123 }
      );
    });
  });
  describe('createQueue', () => {
    it('should call channel.assertQueue', async () => {
      // @ts-ignore
      const rabbitMQManager = new RabbitMQManager(channel);
      rabbitMQManager.createQueue('queueName', { arguments: 123 });
      sandbox.assert.calledWith(
        channel.assertQueue,
        'queueName',
        { arguments: 123 },
      );
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
});
