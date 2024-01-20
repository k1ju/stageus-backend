const redisClient = require('../config/redis')

const recordSearchHistory = async (idx, searchKeyword) => {
    //중복된 값이 있다면 가장 왼쪽으로 이동, // 5개초과는 삭제.

    try {
        await redisClient.ZADD(`searchHistory${idx}`,{ 
            score: new Date().getTime(),
            value: searchKeyword
        }); 

        const setNum = await redisClient.ZCARD(`searchHistory${idx}`)

        if(setNum >= 6){
            await redisClient.ZPOPMIN(`searchHistory${idx}`)
        }

        const rs = await redisClient.zRange(`searchHistory${idx}`,0,-1,'WHTHSCORES')
        
        return rs        

    } catch (e) {
        console.log('에러발생', e);
    }
};

module.exports = recordSearchHistory;
