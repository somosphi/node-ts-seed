import knex, { QueryBuilder, Transaction } from 'knex';

export abstract class MySQLModel<T> {
  protected readonly database: knex;
  protected abstract getTable(): string;

  constructor(database: knex) {
    this.database = database;
  }

  protected transactionable(trx?: Transaction): QueryBuilder {
    if (trx) {
      return this.table.transacting(trx);
    }
    return this.table;
  }

  protected get table(): QueryBuilder {
    return this.database(this.getTable());
  }

  async create(data: Object, trx?: Transaction): Promise<string> {
    const [createdId] = await this.transactionable(trx).insert(data);
    return createdId.toString();
  }

  async all(trx?: Transaction): Promise<T[]> {
    return await this.transactionable(trx);
  }

  async getById(id: string, trx?: Transaction): Promise<T|null> {
    return await this.transactionable(trx).where('id', id).first();
  }

  async deleteById(id: string, trx?: Transaction): Promise<boolean> {
    const result = await this.transactionable(trx).where('id', id).delete();
    return result > 0;
  }

  async updateById(id: string, data: Object, trx?: Transaction): Promise<boolean> {
    const result = await this.transactionable(trx).where('id', id).update(data);
    return result > 0;
  }
}
