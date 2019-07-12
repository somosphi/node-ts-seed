import { assert, sinon, expect } from '../../helpers';
import { UserService } from '../../../src/container/services/user';
import { User } from '../../../src/container/models/user';
import { ResourceNotFoundError } from '../../../src/errors';
import { JsonPlaceholderUser } from '../../../src/container/integrations/json-placeholder';
import { UserSources } from '../../../src/enums';

describe('UserService', () => {

  describe('#all', ()  => {
    it('should return user model all result', async () => {
      const payload: User[] = [];

      const context = {
        userModel: {
          all: sinon.fake.resolves(payload),
        },
      };

      // @ts-ignore
      const userService = new UserService(context);
      const result = await userService.all();

      expect(result).to.be.eql(payload);
      assert(context.userModel.all.calledOnce);
    });
  });

  describe('#findById', () => {
    it('should return user', async () => {
      const payload = { message: 'Ola mundo' };

      const context = {
        userModel: {
          getById: sinon.fake.resolves(payload),
        },
      };

      // @ts-ignore
      const userService = new UserService(context);
      const user = await userService.findById('1');

      expect(user).to.be.eql(payload);
      assert(context.userModel.getById.calledOnceWith('1'));
    });

    it('should throw resource not found error', async () => {
      const payload = null;

      const context = {
        userModel: {
          getById: sinon.fake.resolves(payload),
        },
      };

      // @ts-ignore
      const userService = new UserService(context);

      let error;
      try {
        await userService.findById('1');
      } catch (err) {
        error = err;
      }

      expect(error).to.be.instanceOf(ResourceNotFoundError);
      assert(context.userModel.getById.calledOnceWith('1'));
    });
  });

  describe('#fetchFromJsonPlaceholder', () => {
    it('should fetch all users when database result is empty', async () => {
      const sourceDatabaseUsers: User[] = [];

      const jsonPlaceholderUsers: any[] = [
        {
          name: 'Fulano',
          username: 'fulano',
          email: 'AAA@AAA.com',
        },
      ];

      const placeholderEmails = jsonPlaceholderUsers
        .map(jsonPlaceholderUser => jsonPlaceholderUser.email);

      const context = {
        jsonPlaceholderIntegration: {
          getUsers: sinon.fake.resolves(jsonPlaceholderUsers),
        },
        userModel: {
          getByEmailsWithSource: sinon.fake.resolves(sourceDatabaseUsers),
          create: sinon.fake.resolves('1'),
          transaction: sinon.fake((cb: Function) => cb()),
        },
      };

      // @ts-ignore
      const userService = new UserService(context);
      const fetchedIds = await userService.fetchFromJsonPlaceholder();

      expect(fetchedIds).to.be.eql(['1']);
      assert(context.jsonPlaceholderIntegration.getUsers.calledOnce);
      assert(context.userModel
        .getByEmailsWithSource(placeholderEmails, UserSources.JsonPlaceholder));
      assert(context.userModel.create.calledOnceWith({
        name: jsonPlaceholderUsers[0].name,
        username: jsonPlaceholderUsers[0].username,
        emailAddress: jsonPlaceholderUsers[0].email.toLowerCase(),
        source: UserSources.JsonPlaceholder,
      }));
    });
  });
});
