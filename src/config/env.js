require('dotenv').config();

const env = {
    HTTP_PORT: process.env.HTTP_PORT,

    PSQL_USER: process.env.PSQL_USER,
    PSQL_DATABASE: process.env.PSQL_DATABASE,
    PSQL_PORT: process.env.PSQL_PORT,
    PSQL_HOST: process.env.PSQL_HOST,
    PSQL_PW: process.env.PSQL_PW,

    MONGODB_URI : process.env.MONGODB_URI,
};

module.exports = env;
