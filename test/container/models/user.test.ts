import { UserModel, User } from '../../../src/container/models/user';
import { assert, expect, sinon } from '../../helpers';
import { UserSources } from '../../../src/enums';
import { Transaction } from 'knex';

class UserModelTest extends UserModel {
  transactionable(trx?: Transaction) {
    return super.transactionable(trx);
  }
}

describe('UserModel', () => {
  describe('#getTableName', () => {
    it('should use table "users"', () => {
      // @ts-ignore
      const userModel = new UserModel();
      expect(userModel.getTableName()).to.be.eql('users');
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
      const userModel = new UserModelTest();
      const sourceQuery = sinon.fake.resolves(payload);
      const emailsQuery = sinon.fake.returns({ where: sourceQuery });

      userModel.transactionable = sinon.fake.returns({
        whereIn: emailsQuery,
      });

      const emails = ['fulano@gmail.com'];
      const users = await userModel.getByEmailsWithSource(
        emails,
        UserSources.JsonPlaceholder
      );

      expect(users).to.be.eql(payload);
      assert(sourceQuery.calledOnceWith('source', UserSources.JsonPlaceholder));
      assert(emailsQuery.calledOnceWith('emailAddress', emails));
    });
  });
});
