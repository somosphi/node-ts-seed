import { Transaction } from 'knex';
import { provide } from 'injection';
import { Repository } from './repository';
import { UserSources } from '../../enums';

export interface User {
  id: string;
  name: string;
  username: string;
  emailAddress: string;
  source: UserSources;
  createdAt: Date;
  updatedAt: Date;
}

@provide()
export class UserRepository extends Repository<User> {
  getTableName(): string {
    return 'users';
  }

  async getByEmailsWithSource(
    emails: string[],
    source: UserSources,
    trx?: Transaction
  ): Promise<User[]> {
    return this.transactionable(trx)
      .whereIn('emailAddress', emails)
      .where('source', source);
  }
}
