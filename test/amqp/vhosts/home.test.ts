import { Channel } from 'amqplib';
import { SinonStub } from 'sinon';
import { sinon, expect } from '../../helpers';
import { RabbitMQConfig } from '../../../src/amqp/vhosts';
import { HomeVHost } from '../../../src/amqp/vhosts/home';
import { UserConsumer } from '../../../src/amqp/consumers/user';
import { Consumer } from '../../../src/amqp/consumers/consumer';
import { AppContainer } from '../../../src/container';

const sandbox = sinon.createSandbox();

const testContainer = new AppContainer({
  // @ts-ignore
  jsonPlaceholderConfig: {},
});
const rabbitMQConfig: RabbitMQConfig = {
  protocol: '123',
  host: '123',
  port: 123,
  username: 'user',
  password: 'pass',
};
let fnLoadConsumers: SinonStub;
let fnConsume: SinonStub;
let fnOnConsume: SinonStub;

describe('HomeVHost', () => {
  beforeEach(() => {
    fnLoadConsumers = sandbox.stub();
    fnConsume = sandbox.stub();
    fnOnConsume = sandbox.stub();
  });

  describe('loadConsumers', () => {
    it('should add new UserConsumer', () => {
      const homeVhost = new HomeVHost('home', rabbitMQConfig, testContainer);
      homeVhost.loadConsumers();
      expect(homeVhost.consumers).to.be.an('array');
      expect(homeVhost.consumers[0]).to.be.instanceOf(UserConsumer);
    });
    it('should throw error when container is null', () => {
      const homeVhost = new HomeVHost('home', rabbitMQConfig);
      let error;
      try {
        homeVhost.loadConsumers();
      } catch (err) {
        error = err;
      }
      expect(homeVhost.consumers.length).to.be.equals(0);
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('startConsumers', () => {
    it('should call loadConsumers and consume on queue', () => {
      class TestConsumer extends Consumer {
        onConsume() {
          fnOnConsume();
          return () => {};
        }

        messageHandler() {}
      }

      const consumerOne = new TestConsumer('queue.test', testContainer);
      const consumerTwo = new TestConsumer('queue.test2', testContainer);

      class TestHomeVhost extends HomeVHost {
        channel: Channel;

        constructor(vHost: string, config: RabbitMQConfig) {
          super(vHost, config);
          this.channel = {
            // @ts-ignore
            consume: () => {
              fnConsume();
            },
          };
        }

        loadConsumers() {
          this.consumers = [consumerOne, consumerTwo];
          fnLoadConsumers();
        }
      }
      const homeVhost = new TestHomeVhost('home', rabbitMQConfig);
      homeVhost.startConsumers(testContainer);
      sandbox.assert.calledOnce(fnLoadConsumers);
      sandbox.assert.calledTwice(fnOnConsume);
      sandbox.assert.calledTwice(fnConsume);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
