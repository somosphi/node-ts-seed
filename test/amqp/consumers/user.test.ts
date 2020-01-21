
import { SinonStub } from 'sinon';
import { sinon } from '../../helpers';
import { UserConsumer, FindUserMessage } from '../../../src/amqp/consumers/user';
import { Container, ContainerConfig } from '../../../src/container';
import { BufferConverter } from '../../../src/amqp/buffer-converter';
import validatorMiddleware from '../../../src/amqp/middleware/validator';

const sandbox = sinon.createSandbox();
const buffer = BufferConverter.converter({ id: 123 });
// @ts-ignore
const consumeMessage: ConsumeMessage = { content: buffer };
let fnFindUserById: SinonStub;
let testContainer: Container;
let serviceContext: any;

class TestContainer extends Container {
  constructor(config: ContainerConfig, userService: any) {
    super(config);
    this.userService = userService;
  }
}

describe('UserConsumer', () => {

  beforeEach(() => {
    serviceContext = {
      findById: sandbox.stub()
    };
    fnFindUserById = sandbox.stub();
    sandbox.stub(validatorMiddleware, 'validation')
      // @ts-ignore
      .callsFake(() => (() => 'test'));

    testContainer = new TestContainer(
      // @ts-ignore
      { jsonPlaceholderConfig: {} },
      serviceContext,
    );
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
    }
    it('should validate message and call findUserById', async () => {
      const testUserConsumer = new TestUserConsumer('user.find', testContainer);
      await testUserConsumer.findUserById({ id: '123' });
      sandbox.assert.calledWith(serviceContext.findById, '123');
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
