import amqplib, { Channel, Message } from 'amqplib';
import { sinon, expect } from '../../helpers';
import { RabbitMQ, RabbitMQConfig } from '../../../src/amqp/vhosts';
import { BufferConverter } from '../../../src/amqp/buffer-converter';
import { Consumer } from '../../../src/amqp/consumers/consumer';
import { Container, ContainerConfig } from '../../../src/container';
import * as errors from '../../../src/errors';

let fnMessageHandler: any;
let fnAck: any;
let fnOnConsumeError: any;
let channel: Channel;
class TestCodedError extends errors.CodedError {}

const sandbox = sinon.createSandbox();
const container = new Container({
  // @ts-ignore
  jsonPlaceholderConfig: {},
});
// @ts-ignore
const message: Message = { message: 123 };

describe('Consumer', () => {

  beforeEach(() => {
    fnMessageHandler = sandbox.stub();
    fnAck = sandbox.stub();
    fnOnConsumeError = sandbox.stub();
    // @ts-ignore
    channel = {
      ack: (message: Message) => {
        fnAck(message);
      },
    }
  });

  describe('onConsume', () => {
    class TestConsumer extends Consumer {
      constructor(queue: string, container: Container) {
        super(queue, container);
      }
      messageHandler(message: Message) {
        fnMessageHandler(message);
      }
      onConsumeError() {
        fnOnConsumeError();
      }
    }
    it('should call messageHandler and channel.ack', () => {
      const testConsumer = new TestConsumer('test', container);
      const onConsume = testConsumer.onConsume(channel);
      onConsume(message);
      sandbox.assert.calledOnce(fnMessageHandler);
      sandbox.assert.calledWith(fnMessageHandler, message);
      sandbox.assert.calledOnce(fnAck);
      sandbox.assert.calledWith(fnAck, message);
    });
    it('should not call channel.ack when message is null', () => {
      const testConsumer = new TestConsumer('test', container);
      const onConsume = testConsumer.onConsume(channel);
      onConsume(null);
      sandbox.assert.calledOnce(fnMessageHandler);
      sandbox.assert.calledWith(fnMessageHandler, null);
      sandbox.assert.notCalled(fnAck);
    });
    it('should throw', () => {
      const testConsumer = new TestConsumer('test', container);
      const error = new TestCodedError('test', 'mess');
      fnMessageHandler.throws(error);
      const onConsume = testConsumer.onConsume(channel);
      onConsume(message);
      sandbox.assert.calledOnce(fnMessageHandler);
      sandbox.assert.calledWith(fnMessageHandler, message);
      sandbox.assert.calledOnce(fnOnConsumeError);
      sandbox.assert.calledWith(fnOnConsumeError, error, channel, message);
      sandbox.assert.calledOnce(fnAck);
      sandbox.assert.calledWith(fnAck, message);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
