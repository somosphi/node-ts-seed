import { UserRepository, User } from '../../../src/container/repositories/user';
import { assert, expect, sinon } from '../../helpers';
import { UserSources } from '../../../src/enums';
import { Transaction } from 'knex';

class UserRepositoryTest extends UserRepository {
  transactionable(trx?: Transaction) {
    return super.transactionable(trx);
  }
}

describe('UserRepository', () => {
  describe('#getTableName', () => {
    it('should use table "users"', () => {
      // @ts-ignore
      const userRepository = new UserRepository();
      expect(userRepository.getTableName()).to.be.eql('users');
    });
  });

  describe('#getByEmailsWithSource', () => {
    it('should call whereIn and where methods without transaction', async () => {
      const payload: User[] = [
        {
          id: '1',
          name: 'Fulano',
          username: 'fulano',
          emailAddress: 'fulano@gmail.com',
          source: UserSources.JsonPlaceholder,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // @ts-ignore
      const userRepository = new UserRepositoryTest();
      const sourceQuery = sinon.fake.resolves(payload);
      const emailsQuery = sinon.fake.returns({ where: sourceQuery });

      userRepository.transactionable = sinon.fake.returns({
        whereIn: emailsQuery,
      });

      const emails = ['fulano@gmail.com'];
      const users = await userRepository.getByEmailsWithSource(
        emails,
        UserSources.JsonPlaceholder
      );

      expect(users).to.be.eql(payload);
      assert(sourceQuery.calledOnceWith('source', UserSources.JsonPlaceholder));
      assert(emailsQuery.calledOnceWith('emailAddress', emails));
    });
  });
});
