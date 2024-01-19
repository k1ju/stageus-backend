const redisClient = require('../config/redis')
console.log('redisClient: ', redisClient);



const recordSearchHistory = async (idx, searchKeyword) => {
    //중복된 값이 있다면 가장 왼쪽으로 이동, // 5개초과는 삭제.

    try {
        console.log('idx, searchKeyword: ', idx, searchKeyword);

        const timestamp = new Date().getTime();
        console.log('timestamp: ', timestamp);

        // idx = idx.toString();
        console.log('idx: ', idx);


        https://stackoverflow.com/questions/74905562/node-redis-cant-work-in-zadd-with-typeerror-cannot-read-properties-of-undefine
        // await redis.zAdd(`searchHistory${idx}`, timestamp, `${searchKeyword}`); // 에러나는 이유 물어보기
        await redisClient.zAdd(`searchHistory${idx}`, timestamp, searchKeyword); // 에러나는 이유 물어보기

        //   const setNum = await redis.zCard(`searchHistory${idx}`)
        //   console.log('setNum: ', setNum);

    } catch (e) {
        console.log('에러발생', e);
    }
};

module.exports = recordSearchHistory;
