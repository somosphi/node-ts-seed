import amqplib from 'amqplib';
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
}
const config: RabbitMQConfig = {
  protocol: '123',
  host: '123',
  port: 123,
  username: 'user',
  password: 'pass',
}
const sandbox = sinon.createSandbox();
let clock: any;

let fnConnectionConfig: any;
let fnHandleOnError: any;
let fnRecconect: any;
let connection: any;
let fnPublish: any;
let fnConnectionOn: any;
let fnInit: any;

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
      createChannel: sandbox.stub(),
    };
    sandbox.stub(amqplib, 'connect')
      // @ts-ignore
      .callsFake(() => connection);

  });

  describe('init', () => {
    class TestVHost extends RabbitMQ {
      constructor(vHost: string, config: RabbitMQConfig) {
        super(vHost, config);
      }
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
      const testVhost = new TestVHost('test', config);

      await testVhost.init();
      // @ts-ignore
      sandbox.assert.calledWith(amqplib.connect, connConfig);
      sandbox.assert.calledOnce(fnConnectionConfig);
      sandbox.assert.calledOnce(fnHandleOnError);
      sandbox.assert.calledOnce(connection.createChannel);
    });
    it('should throw error', async () => {
      const testVhost = new TestVHost('test', config);

      fnConnectionConfig.throws();
      await testVhost.init();

      sandbox.assert.calledOnce(fnRecconect);
    });
  });

  describe('send', () => {
    class TestVHost extends RabbitMQ {
      constructor(vHost: string, config: RabbitMQConfig) {
        super(vHost, config);
        this.channel = {
          // @ts-ignore
          publish: (
            exchange,
            routingKey,
            message,
          ) => {
            fnPublish(exchange, routingKey, message);
          },
        }
      }
    }

    it('should call publish method', () => {
      const testVhost = new TestVHost('test', config);

      testVhost.send(
        'test',
        'routingKey',
        { message: 'test' },
      );
      sandbox.assert.calledWith(
        fnPublish,
        'test',
        'routingKey',
        BufferConverter.converter({ message: 'test' }),
      );
    });

    it('should throw error', () => {
      const testVhost = new TestVHost('test', config);
      fnPublish.throws();

      expect(
        () => {
          testVhost.send(
            'test',
            'routingKey',
            { message: 'test' },
          );
        }
      ).to.throws();

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
        }
      }
      handleOnError() {
        super.handleOnError();
      }
      reconnect() {
        fnRecconect();
      }
    }

    it('should call connection.on thrice', () => {
      const testVhost = new TestVHost('test', config);
      testVhost.handleOnError();
      sandbox.assert.calledThrice(fnConnectionOn);
    });

    it('should call reconnect twice', () => {
      const testVhost = new TestVHost('test', config);
      testVhost.handleOnError();
      sandbox.assert.calledTwice(fnRecconect);
    });
    it('should call connection.on with args', () => {
      const testVhost = new TestVHost('test', config);
      testVhost.handleOnError();
      sandbox.assert.calledWith(
        fnConnectionOn,
        'blocked',
      );
      sandbox.assert.calledWith(
        fnConnectionOn,
        'close',
      );
      sandbox.assert.calledWith(
        fnConnectionOn,
        'error',
      );
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
        super.reconnect();
      }
      getChannel() {
        return this.channel;
      }
      getConnection() {
        return this.connection;
      }
    }

    it('should delete channel prop', () => {
      const testVhost = new TestVHost('test', config);
      testVhost.reconnect();
      expect(testVhost.getChannel()).to.be.undefined;
    });
    it('should delete connection prop', () => {
      const testVhost = new TestVHost('test', config);
      testVhost.reconnect();
      expect(testVhost.getConnection()).to.be.undefined;
    });
    it('should call init method after 5000ms', () => {
      const testVhost = new TestVHost('test', config);
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
