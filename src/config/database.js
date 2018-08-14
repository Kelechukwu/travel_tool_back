const env = require('./environment.js');

const defaultConfig = {
  databaseUrl: env.DATABASE_URL,
  dialect: env.DATABASE_DIALECT || 'postgres',
  use_env_variable: 'DATABASE_URL',
};

const database = {
  development: {
    ...defaultConfig,
  },
  test: {
    ...defaultConfig,
    databaseUrl: env.DATABASE_URL_TEST,
    use_env_variable: 'DATABASE_URL_TEST',
  },
  staging: {
    ...defaultConfig,
  },
  production: {
    ...defaultConfig,
  },
};

// DO NOT CHANGE EVER!!!
module.exports = database;
