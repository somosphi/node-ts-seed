import amqplib from 'amqplib';
import { SinonStub } from 'sinon';
import { sinon, expect } from '../../helpers';
import { RabbitMQ, RabbitMQConfig } from '../../../src/amqp/vhosts';
import { BufferConverter } from '../../../src/amqp/buffer-converter';

const connConfig = {
  hostname: 'host',
  username: 'user',
  password: 'pass',
  protocol: 'test',
  port: 3000,
  vhost: 'test',
};

const rabbitMQConfig: RabbitMQConfig = {
  protocol: '123',
  host: '123',
  port: 123,
  username: 'user',
  password: 'pass',
  consumerPrefetch: 10,
  producerPrefetch: 10,
};

const sandbox = sinon.createSandbox();
let clock: any;

let connection: any;
let fnConnectionConfig: SinonStub;
let fnHandleOnError: SinonStub;
let fnRecconect: SinonStub;
let fnPublish: SinonStub;
let fnConnectionOn: SinonStub;
let fnInit: SinonStub;

describe('RabbitMQ', () => {
  beforeEach(() => {
    clock = sandbox.useFakeTimers();
    fnConnectionConfig = sandbox.stub().returns(connConfig);
    fnHandleOnError = sandbox.stub();
    fnRecconect = sandbox.stub();
    fnPublish = sandbox.stub();
    fnConnectionOn = sandbox.stub();
    fnInit = sandbox.stub();

    connection = {
      createChannel: sandbox.stub().returns({
        prefetch: sandbox.stub(),
      }),
      createConfirmChannel: sandbox.stub().returns({
        prefetch: sandbox.stub(),
      }),
    };
    sandbox
      .stub(amqplib, 'connect')
      // @ts-ignore
      .callsFake(() => connection);
  });

  describe('init', () => {
    class TestVHost extends RabbitMQ {
      connectionConfig() {
        return fnConnectionConfig();
      }

      handleOnError() {
        fnHandleOnError();
      }

      reconnect() {
        fnRecconect();
      }
    }

    it('should connect, handleErros and create channel', async () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);

      // @ts-ignore
      await testVhost.init({});

      // @ts-ignore
      sandbox.assert.calledWith(amqplib.connect, connConfig);
      sandbox.assert.calledOnce(fnConnectionConfig);
      sandbox.assert.calledOnce(fnHandleOnError);
      sandbox.assert.calledOnce(connection.createConfirmChannel);
      sandbox.assert.calledOnce(connection.createChannel);
    });

    it('should throw error', async () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);

      fnConnectionConfig.throws();

      // @ts-ignore
      await testVhost.init({});

      sandbox.assert.calledOnce(fnRecconect);
    });

    it('shoud start producers and consumers', async () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);

      // @ts-ignore
      await testVhost.init({});

      sandbox.assert.calledOnce(connection.createConfirmChannel);
      sandbox.assert.calledOnce(connection.createChannel);
    });

    it('shoud start only producers', async () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      const initOptions = {
        startConsumers: false,
        startProducers: true,
      };
      // @ts-ignore
      await testVhost.init({}, initOptions);

      sandbox.assert.calledOnce(connection.createConfirmChannel);
      sandbox.assert.notCalled(connection.createChannel);
    });

    it('shoud start only consumers', async () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      const initOptions = {
        startConsumers: true,
        startProducers: false,
      };
      // @ts-ignore
      await testVhost.init({}, initOptions);

      sandbox.assert.notCalled(connection.createConfirmChannel);
      sandbox.assert.calledOnce(connection.createChannel);
    });
  });

  describe('send', () => {
    class TestVHost extends RabbitMQ {
      constructor(vHost: string, config: RabbitMQConfig) {
        super(vHost, config);
        this.producerChannel = {
          // @ts-ignore
          publish: (exchange, routingKey, message) => {
            fnPublish(exchange, routingKey, message);
          },
        };
      }
    }

    it('should call publish method', () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);

      testVhost.send('test', 'routingKey', { message: 'test' });
      sandbox.assert.calledWith(
        fnPublish,
        'test',
        'routingKey',
        BufferConverter.converter({ message: 'test' })
      );
    });

    it('should throw error', async () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      fnPublish.throws();

      try {
        await testVhost.send('test', 'routingKey', { message: 'test' });
        sandbox.assert.fail('should throwed error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('handleOnError', () => {
    class TestVHost extends RabbitMQ {
      constructor(vHost: string, config: RabbitMQConfig) {
        super(vHost, config);
        this.connection = {
          // @ts-ignore
          on: (action, fn) => {
            fn();
            fnConnectionOn(action, fn);
          },
        };
      }

      handleOnError() {
        // @ts-ignore
        super.handleOnError({});
      }

      reconnect() {
        fnRecconect();
      }
    }

    it('should call connection.on thrice', () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      testVhost.handleOnError();
      sandbox.assert.calledThrice(fnConnectionOn);
    });

    it('should call reconnect twice', () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      testVhost.handleOnError();
      sandbox.assert.calledTwice(fnRecconect);
    });
    it('should call connection.on with args', () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      testVhost.handleOnError();
      sandbox.assert.calledWith(fnConnectionOn, 'blocked');
      sandbox.assert.calledWith(fnConnectionOn, 'close');
      sandbox.assert.calledWith(fnConnectionOn, 'error');
    });
  });

  describe('reconnect', () => {
    class TestVHost extends RabbitMQ {
      constructor(vHost: string, config: RabbitMQConfig) {
        super(vHost, config);
        // @ts-ignore
        this.channel = { test: 123 };
        // @ts-ignore
        this.connection = { test: 123 };
      }

      // @ts-ignore
      init() {
        fnInit();
      }

      reconnect() {
        // @ts-ignore
        super.reconnect({});
      }

      getConsumerChannel() {
        return this.consumerChannel;
      }

      getConnection() {
        return this.connection;
      }
    }

    it('should delete channel prop', () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      testVhost.reconnect();
      expect(testVhost.getConsumerChannel()).to.be.undefined;
    });

    it('should call init method after 5000ms', () => {
      const testVhost = new TestVHost('test', rabbitMQConfig);
      testVhost.reconnect();
      sandbox.assert.notCalled(fnInit);
      clock.tick(5100);
      sandbox.assert.calledOnce(fnInit);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
