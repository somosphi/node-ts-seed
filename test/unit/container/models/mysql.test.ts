import { Transaction } from 'knex';
import { assert, expect, sinon } from '../../helpers';
import { MySQLModel } from '../../../../src/container/models/mysql';

class TestModel extends MySQLModel<any> {
  static tableName: 'test';

  get table() {
    return super.table;
  }

  getTableName(): string {
    return TestModel.tableName;
  }

  transactionable(trx: Transaction) {
    return super.transactionable(trx);
  }
}

describe('MySQLModel', () => {

  describe('#getTableName', () => {
    it('should return table name', () => {
      // @ts-ignore
      const testModel = new TestModel();
      expect(testModel.getTableName()).to.be.eql(TestModel.tableName);
    });
  });

  describe('#table', () => {
    it('should return query with table filter', () => {
      const databaseQuery = sinon.fake.returns({});

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);
      testModel.table;

      assert(databaseQuery.calledOnceWith(TestModel.tableName));
    });
  });

  describe('#transactionable', () => {
    it('should return transactionable query on send trx', () => {
      const transactingQuery = sinon.fake.returns({});

      const databaseQuery = sinon.fake.returns({
        transacting: transactingQuery,
      });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const transactionableResult = testModel.transactionable({});

      expect(transactionableResult).to.be.eql({});
      assert(transactingQuery.calledOnceWith({}));
    });

    it('should return default query on send empty trx', () => {
      const databaseQuery = sinon.fake.returns({});

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const transactionableResult = testModel.transactionable();

      expect(transactionableResult).to.be.eql({});
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
    });
  });

  describe('#create', () => {
    it('should return created id parsed to string', async () => {
      const insertQuery = sinon.fake.resolves([123]);

      const databaseQuery = sinon.fake.returns({
        insert: insertQuery,
      });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const insertData = { message: 'Ola mundo' };
      const createdId = await testModel.create(insertData);

      expect(createdId).to.be.eql('123');
      assert(insertQuery.calledOnceWith(insertData));
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
    });
  });

  describe('#all', () => {
    it('should return database query without filter', async () => {
      const payload = [
        { message: 'Ola mundo' },
      ];

      const databaseQuery = sinon.fake.resolves(payload);

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);
      const result = await testModel.all();

      expect(result).to.be.eql(payload);
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
    });
  });

  describe('#getById', () => {
    it('should return null when first return null', async () => {
      const firstQuery = sinon.fake.resolves(null);
      const whereQuery = sinon.fake.returns({ first: firstQuery });
      const databaseQuery = sinon.fake.returns({ where: whereQuery });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const result = await testModel.getById('1');
      expect(result).to.be.eql(null);
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
      assert(whereQuery.calledOnceWith('id', '1'));
      assert(firstQuery.calledOnce);
    });

    it('should return result when first return data', async () => {
      const payload = { message: 'Ola mundo' };

      const firstQuery = sinon.fake.resolves(payload);
      const whereQuery = sinon.fake.returns({ first: firstQuery });
      const databaseQuery = sinon.fake.returns({ where: whereQuery });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);

      const result = await testModel.getById('1');
      expect(result).to.be.eql(payload);
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
      assert(whereQuery.calledOnceWith('id', '1'));
      assert(firstQuery.calledOnce);
    });
  });

  describe('#deleteById', () => {
    it('should return false when delete 0 records', async () => {
      const deletedQuery = sinon.fake.resolves(0);
      const whereQuery = sinon.fake.returns({ delete: deletedQuery });
      const databaseQuery = sinon.fake.returns({ where: whereQuery });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);
      const deleted = await testModel.deleteById('1');

      expect(deleted).to.be.eql(false);
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
      assert(whereQuery.calledOnceWith('id', '1'));
      assert(deletedQuery.calledOnce);
    });

    it('should return true when delete one or more records', async () => {
      const deletedQuery = sinon.fake.resolves(1);
      const whereQuery = sinon.fake.returns({ delete: deletedQuery });
      const databaseQuery = sinon.fake.returns({ where: whereQuery });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);
      const deleted = await testModel.deleteById('1');

      expect(deleted).to.be.eql(true);
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
      assert(whereQuery.calledOnceWith('id', '1'));
      assert(deletedQuery.calledOnce);
    });
  });

  describe('#updateById', () => {
    it('should return false when update 0 records', async () => {
      const updateQuery = sinon.fake.resolves(0);
      const whereQuery = sinon.fake.returns({ update: updateQuery });
      const databaseQuery = sinon.fake.returns({ where: whereQuery });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);
      const updateData = { message: 'Ola mundo' };
      const deleted = await testModel.updateById('1', updateData);

      expect(deleted).to.be.eql(false);
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
      assert(whereQuery.calledOnceWith('id', '1'));
      assert(updateQuery.calledOnceWith(updateData));
    });

    it('should return true when update one or more records', async () => {
      const updateQuery = sinon.fake.resolves(1);
      const whereQuery = sinon.fake.returns({ update: updateQuery });
      const databaseQuery = sinon.fake.returns({ where: whereQuery });

      // @ts-ignore
      const testModel = new TestModel(databaseQuery);
      const updateData = { message: 'Ola mundo' };
      const deleted = await testModel.updateById('1', updateData);

      expect(deleted).to.be.eql(true);
      assert(databaseQuery.calledOnceWith(TestModel.tableName));
      assert(whereQuery.calledOnceWith('id', '1'));
      assert(updateQuery.calledOnceWith(updateData));
    });
  });
});
