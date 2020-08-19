import amqplib from 'amqplib';
import { SinonStub } from 'sinon';
import { sinon } from '../helpers';
import { RabbitMQ, RabbitMQConfig } from '../../src/amqp/vhosts';
import { AMQPServer } from '../../src/amqp/index';
import { AppContainer } from '../../src/container';

const rabbitMQConfig: RabbitMQConfig = {
  protocol: '123',
  host: '123',
  port: 123,
  username: 'user',
  password: 'pass',
};
const testContainer = new AppContainer({
  // @ts-ignore
  jsonPlaceholderConfig: {},
});
let connection: any;
let fnTestVhostInit: SinonStub;
let fnNoConsumerVhostInit: SinonStub;
let fnTestVhostStartConsumers: SinonStub;

const sandbox = sinon.createSandbox();

describe('AMQPServer', () => {
  beforeEach(() => {
    fnTestVhostInit = sandbox.stub();
    fnNoConsumerVhostInit = sandbox.stub();
    fnTestVhostStartConsumers = sandbox.stub();

    connection = {
      createChannel: sandbox.stub(),
    };
    sandbox
      .stub(amqplib, 'connect')
      // @ts-ignore
      .callsFake(() => connection);
  });

  class TestVHost extends RabbitMQ {
    async init(): Promise<void> {
      fnTestVhostInit();
    }

    startConsumers(container: AppContainer): void {
      fnTestVhostStartConsumers();
    }
  }
  class TestNoConsumerVHost extends RabbitMQ {
    async init(): Promise<void> {
      fnNoConsumerVhostInit();
    }
  }
  const testVhosts = {
    test: new TestVHost('test', rabbitMQConfig),
    testNoConsumer: new TestNoConsumerVHost('noConsumer', rabbitMQConfig),
  };
  class TestAMQPServer extends AMQPServer {
    setVHosts(vhosts: any) {
      this.vhosts = vhosts;
    }
  }
  describe('start', () => {
    it('should init all vhosts', async () => {
      const amqpServer = new TestAMQPServer(rabbitMQConfig, true);
      amqpServer.setVHosts(testVhosts);

      await amqpServer.start();
      sandbox.assert.calledOnce(fnTestVhostInit);
      sandbox.assert.calledOnce(fnNoConsumerVhostInit);
    });
    it('should not init vhosts when server is disabled', async () => {
      const amqpServer = new TestAMQPServer(rabbitMQConfig, false);
      amqpServer.setVHosts(testVhosts);

      await amqpServer.start();
      sandbox.assert.notCalled(fnTestVhostInit);
      sandbox.assert.notCalled(fnNoConsumerVhostInit);
    });
  });
  describe('startAllConsumers', () => {
    it('should start consumers', async () => {
      const amqpServer = new TestAMQPServer(rabbitMQConfig, true);
      amqpServer.setVHosts(testVhosts);

      await amqpServer.startAllConsumers(testContainer);
      sandbox.assert.calledOnce(fnTestVhostStartConsumers);
    });
    it('should not start consumers when server is disabled', async () => {
      const amqpServer = new TestAMQPServer(rabbitMQConfig, false);
      amqpServer.setVHosts(testVhosts);

      await amqpServer.startAllConsumers(testContainer);
      sandbox.assert.notCalled(fnTestVhostStartConsumers);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
