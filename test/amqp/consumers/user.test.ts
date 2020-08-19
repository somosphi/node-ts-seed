import { sinon, assert } from '../../helpers';
import { UserConsumer } from '../../../src/amqp/consumers/user';
import { BufferConverter } from '../../../src/amqp/buffer-converter';
import * as validatorMiddleware from '../../../src/amqp/middleware/validator';
import { findUserSchema } from '../../../src/amqp/schemas/user';

let testContainer: any;

describe('UserConsumer', () => {
  beforeEach(() => {
    testContainer = {
      get: (className: Function) => testContainer[className.name],
    };
  });

  describe('messageHandler', () => {
    it('should validate message and call findUserById', () => {
      testContainer.UserService = {};

      const message = 'test';
      const fakeFunctionMessage = sinon.fake.returns(message);

      const fakeFindUserById = sinon.fake.resolves({});
      const validatorStub = sinon
        .stub(validatorMiddleware, 'validation')
        // @ts-ignore
        .returns(fakeFunctionMessage);

      const testUserConsumer = new UserConsumer('user.find', testContainer);
      testUserConsumer.findUserById = fakeFindUserById;

      const buffer = BufferConverter.converter({ id: 123 });
      // @ts-ignore
      const consumeMessage: ConsumeMessage = { content: buffer };
      testUserConsumer.messageHandler(consumeMessage);

      assert(validatorStub.calledOnceWith(findUserSchema));
      assert(fakeFindUserById.calledOnceWith(message));
    });
  });

  describe('findUserById', () => {
    it('should validate message and call findUserById', async () => {
      testContainer.UserService = {
        findById: sinon.fake.resolves({ yolo: 'yolo' }),
      };

      const testUserConsumer = new UserConsumer('user.find', testContainer);
      const data = { id: '123' };

      await testUserConsumer.findUserById(data);
      assert(testContainer.UserService.findById.calledOnceWith(data.id));
    });
  });
});
