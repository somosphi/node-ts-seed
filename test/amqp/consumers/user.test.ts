import { Channel, Message } from 'amqplib';
import { sinon } from '../../helpers';
import { UserConsumer, FindUserMessage } from '../../../src/amqp/consumers/user';
import { Container } from '../../../src/container';
import { BufferConverter } from '../../../src/amqp/buffer-converter';
import * as errors from '../../../src/errors';
import validatorMiddleware from '../../../src/amqp/middleware/validator';

const sandbox = sinon.createSandbox();
const buffer = BufferConverter.converter({ id: 123 });
// @ts-ignore
const consumeMessage: ConsumeMessage = { content: buffer };
let fnFindUserById: any;
let fnFindById: any;
let testContainer: Container;

sandbox.stub(validatorMiddleware, 'validation')
  // @ts-ignore
  .callsFake(() => (() => 'test'));

describe('UserConsumer', () => {

  beforeEach(() => {
    fnFindById = sandbox.stub();
    fnFindUserById = sandbox.stub();
    testContainer = new Container({
      // @ts-ignore
      jsonPlaceholderConfig: {},
      userService: {
        findById: (id: string) => {
          console.log('AAAAAAAAAAAA');

          fnFindById(id);
        }
      },
    });
  });

  describe('messageHandler', () => {
    class TestUserConsumer extends UserConsumer {
      async findUserById(findUserMessage: FindUserMessage) {
        fnFindUserById(findUserMessage);
      }
    }
    it('should validate message and call findUserById', () => {
      const testUserConsumer = new TestUserConsumer('user.find', testContainer);
      testUserConsumer.messageHandler(consumeMessage);
      sandbox.assert.calledWith(fnFindUserById, 'test');
    });
  });

  describe('findUserById', () => {
    class TestUserConsumer extends UserConsumer {
      setContainer(container) {
        this.container = container;
      }
    }
    it('should validate message and call findUserById', async () => {
      const testUserConsumer = new TestUserConsumer('user.find', testContainer);
      await testUserConsumer.findUserById({ id: '123' });
      sandbox.assert.calledOnce(fnFindById);
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
