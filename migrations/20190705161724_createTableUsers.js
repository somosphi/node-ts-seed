/**
* @param {import('knex')} knex
*/
exports.up = knex => knex.schema.createTable('users', (table) => {
  table.bigIncrements('id').unsigned();
  table.string('name').notNullable();
  table.string('username').notNullable();
  table.enu('source', ['JSON_PLACEHOLDER']).notNullable();
  table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
});

/**
* @param {import('knex')} knex
*/
exports.down = knex => knex.schema.dropTable('users');
