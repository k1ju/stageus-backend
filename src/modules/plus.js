const redis = require('redis').createClient();

const plus = async (plusTmp) => {
    try {
        await redis.connect();

        const plusTmp = redis.get(`${plusTmp}`);

        if (plusTmp) {
            console.log(plusTmp)
            await redis.set(`${plusTmp}`, parseInt(plusTmp) + 1);
        } else {
            await redis.set(`${plusTmp}`, 1);
        }
    } catch (e) {
        next(e);
    } finally {
        redis.disconnect();
    }
};

module.exports = plus;
