import amqplib, { Channel, Message } from 'amqplib';
import { sinon, expect } from '../helpers';
import { RabbitMQ, RabbitMQConfig } from '../../src/amqp/vhosts';
import { AMQPServer } from '../../src/amqp/index';
import { Consumer } from '../../src/amqp/consumers/consumer';
import { HomeVHost } from '../../src/amqp/vhosts/home';
import { WorkVHost } from '../../src/amqp/vhosts/work';
import { Container } from '../../src/container';

const rabbitMQConfig: RabbitMQConfig = {
  protocol: '123',
  host: '123',
  port: 123,
  username: 'user',
  password: 'pass',
}
const testContainer = new Container({
  // @ts-ignore
  jsonPlaceholderConfig: {},
});
let connection: any;
let fnHomeVhostInit: any;
let fnWorkVhostInit: any;
let fnHomeVhostStartConsumers: any;

const sandbox = sinon.createSandbox();

describe('AMQPServer', () => {

  beforeEach(() => {
    fnHomeVhostInit = sandbox.stub();
    fnWorkVhostInit = sandbox.stub();
    fnHomeVhostStartConsumers = sandbox.stub();

    connection = {
      createChannel: sandbox.stub(),
    };
    sandbox.stub(amqplib, 'connect')
      // @ts-ignore
      .callsFake(() => connection);
  });

  class TestHomeVHost extends HomeVHost {
    async init(): Promise<void> {
      fnHomeVhostInit();
    }
    startConsumers(container: Container): void {
      fnHomeVhostStartConsumers();
    }
  }
  class TestWorkVHost extends WorkVHost {
    async init(): Promise<void> {
      fnWorkVhostInit();
    }
  }
  const testVhosts = {
    home: new TestHomeVHost('home', rabbitMQConfig),
    work: new TestWorkVHost('work', rabbitMQConfig),
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
      sandbox.assert.calledOnce(fnHomeVhostInit);
      sandbox.assert.calledOnce(fnWorkVhostInit);
    });
    it('should not init vhosts when server is disabled', async () => {
      const amqpServer = new TestAMQPServer(rabbitMQConfig, false);
      amqpServer.setVHosts(testVhosts);

      await amqpServer.start();
      sandbox.assert.notCalled(fnHomeVhostInit);
      sandbox.assert.notCalled(fnWorkVhostInit);
    });
  });
  describe('startAllConsumers', () => {
    it('should start consumers', async () => {
      const amqpServer = new TestAMQPServer(rabbitMQConfig, true);
      amqpServer.setVHosts(testVhosts);

      await amqpServer.startAllConsumers(testContainer);
      sandbox.assert.calledOnce(fnHomeVhostStartConsumers);
    });
    it('should not start consumers when server is disabled', async () => {
      const amqpServer = new TestAMQPServer(rabbitMQConfig, false);
      amqpServer.setVHosts(testVhosts);

      await amqpServer.startAllConsumers(testContainer);
      sandbox.assert.notCalled(fnHomeVhostStartConsumers);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
