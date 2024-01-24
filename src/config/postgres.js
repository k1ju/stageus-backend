const { Pool } = require('pg');
const env = require('./env');


const psqlDBconfig = {
    host: env.PSQL_HOST,
    port: env.PSQL_PORT,
    user: env.PSQL_USER,
    password: env.PSQL_PW,
    database: env.PSQL_DATABASE,
    idleTimeoutMillis: 10 * 1000,
    connectionTimeoutMillis: 15 * 1000,
};

const pool = new Pool(psqlDBconfig);

pool.query('SELECT now()')
    .then((result) => {
        console.log('pSQL db연결');
    })
    .catch((e) => {
        console.log('pSQL연결실패', e);
    });

module.exports = {
    pool,
};
