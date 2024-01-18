const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
    host: env.PSQL_HOST,
    port: env.PSQL_PORT,
    user: env.PSQL_USER,
    password: env.PSQL_PW,
    database: env.PSQL_DATABASE,
    idleTimeoutMillis: 10 * 1000,
    connectionTimeoutMillis: 15 * 1000,
});

module.exports = {
    pool,
};
