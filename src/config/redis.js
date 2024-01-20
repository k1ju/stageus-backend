const redis = require('redis');
const { REDIS_HOST, REDIS_PORT, REDIS_PW } = require('./env');

const redisConfig = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PW,
};

const redisClient = redis.createClient();
// const redisClient = redis.createClient({
//     url:`redis://54.180.119.163:6379`
// });

redisClient.connect();

module.exports = redisClient;
