require('dotenv').config();

const env = {
    HTTP_PORT: process.env.HTTP_PORT,

    PSQL_USER: process.env.PSQL_USER,
    PSQL_DATABASE: process.env.PSQL_DATABASE,
    PSQL_PORT: process.env.PSQL_PORT,
    PSQL_HOST: process.env.PSQL_HOST,
    PSQL_PW: process.env.PSQL_PW,

    MONGODB_URI : process.env.MONGODB_URI,

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PW: process.env.REDIS_PW,

    secretCode : process.env.SECRETCODE,

    AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

};

module.exports = env;
