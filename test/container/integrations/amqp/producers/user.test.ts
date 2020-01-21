import { Options } from 'amqplib';
import { sinon } from '../../../../helpers';
import { UserProducer } from '../../../../../src/container/integrations/amqp/producers/user';

const sandbox = sinon.createSandbox();

describe('UserProducer', () => {
  describe('send', () => {
    it('should call vHost.send', () => {
      const vhost = {
        send: sandbox.stub(),
      };
      // @ts-ignore
      const userProducer = new UserProducer(vhost);
      const optionsConfig: Options.Publish = {
        priority: 0,
        deliveryMode: 2,
        contentEncoding: 'UTF-8',
        contentType: 'application/json',
      };
      userProducer.send('message');
      sandbox.assert.calledWith(
        vhost.send,
        userProducer.exchange,
        userProducer.routingKey,
        'message',
        optionsConfig,
      );
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
