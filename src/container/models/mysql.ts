import knex, { QueryBuilder, Transaction } from 'knex';

export abstract class MySQLModel<T> {
  protected readonly database: knex;
  protected abstract getTable(): string;

  constructor(database: knex) {
    this.database = database;
  }

  protected transactionable(trx?: Transaction): QueryBuilder {
    if (trx) {
      this.table.transacting(trx);
    }
    return this.table;
  }

  protected get table(): QueryBuilder {
    return this.database(this.getTable());
  }

  async create(data: Object, trx?: Transaction): Promise<string> {
    const query = this.transactionable(trx);
    const result = await query.insert(data);
    return result[0].toString();
  }

  async all(trx?: Transaction): Promise<T[]> {
    const query = this.transactionable(trx);
    return await query;
  }

  async getById(id: string, trx?: Transaction): Promise<T|null> {
    const query = this.transactionable(trx);
    return await query.where('id', id).first();
  }

  async deleteById(id: string, trx?: Transaction): Promise<boolean> {
    const query = this.transactionable(trx);
    const result = await query.where('id', id).delete();
    return result > 0;
  }

  async updateById(id: string, data: Object, trx?: Transaction): Promise<boolean> {
    const query = this.transactionable(trx);
    const result = await query.where('id', id).update(data);
    return result > 0;
  }
}
