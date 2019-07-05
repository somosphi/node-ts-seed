/**
* @param {import('knex')} knex
*/
exports.up = knex => {
  return knex.schema.createTable('user', (table) =>{
    table.bigIncrements('id').unsigned();
    table.
  });
};

/**
* @param {import('knex')} knex
*/
exports.down = knex => {
  
};
