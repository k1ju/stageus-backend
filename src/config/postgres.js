const { Pool } = require('pg');
const env = require('./env');


const psqlDBconfig = {
    host: env.PSQL_HOST,
    port: env.PSQL_PORT,
    user: env.PSQL_USER,
    password: env.PSQL_PW,
    database: env.PSQL_DATABASE,
    // idleTimeoutMillis: 10 * 1000,
    // connectionTimeoutMillis: 15 * 1000,
};

const pool = new Pool(psqlDBconfig);

// console.log('env.PSQL_HOST: ', env.PSQL_HOST);
// console.log('env.PSQL_PORT: ', env.PSQL_PORT);
// console.log('env.PSQL_USER: ', env.PSQL_USER);
// console.log('env.PSQL_PW: ', env.PSQL_PW);
// console.log('env.PSQL_DATABASE: ', env.PSQL_DATABASE);

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
