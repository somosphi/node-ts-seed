const env = require('./src/env');

/**
 * @type {import('knex').Config}
 */
module.exports = {
  client: 'mysql2',
  connection: {
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    typeCast: (field, next) => {
      switch (field.type) {
        case 'TINY': {
          return field.string() === '1';
        }
      }
      return next();
    },
    bigNumberStrings: true,
  },
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
  },
  migrations: {
    tableName: 'migrations',
  },
};
