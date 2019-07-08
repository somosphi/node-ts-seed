import { Transaction } from 'knex';
import { MySQLModel } from './mysql';
import { UserSources } from '../../enums';

export interface User {
  id: string;
  name: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel extends MySQLModel<User> {

  getTable(): string {
    return 'users';
  }

  async getByEmailsWithSource(
    emails: string[], source: UserSources, trx?: Transaction,
  ): Promise<User[]> {
    return await this.transactionable(trx)
      .whereIn('emailAddress', emails)
      .where('source', source);
  }

  

  async removeByEmailAddresses(emailAddresses: string[], trx?: Transaction): Promise<void> {
    const query = this.transactionable(trx);
    await query.whereIn('emailAddress', emailAddresses).delete();
  }
}
