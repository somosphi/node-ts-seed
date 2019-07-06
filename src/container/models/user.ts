import { Transaction } from 'knex';
import { MySQLModel } from './mysql';

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

  async removeByEmailAddresses(emailAddresses: string[], trx?: Transaction): Promise<void> {
    const query = this.transactionable(trx);
    await query.whereIn('emailAddress', emailAddresses).delete();
  }
}
