import { Channel, Message } from 'amqplib';
import { SinonStub } from 'sinon';
import { sinon } from '../../helpers';
import { Consumer } from '../../../src/amqp/consumers/consumer';
import { AppContainer } from '../../../src/container';
import * as errors from '../../../src/errors';

let fnMessageHandler: SinonStub;
let fnAck: SinonStub;
let fnOnConsumeError: SinonStub;
let channel: Channel;
class TestCodedError extends errors.CodedError {}

const container = new AppContainer({
  // @ts-ignore
  jsonPlaceholderConfig: {},
});
// @ts-ignore
const message: Message = { message: 123 };
const sandbox = sinon.createSandbox();

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
    };
  });

  describe('onConsume', () => {
    class TestConsumer extends Consumer {
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
      sandbox.assert.calledOnce(fnAck);
      sandbox.assert.calledWith(fnAck, message);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
