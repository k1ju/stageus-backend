const redisClient = require('../config/redis')


// 검색기록 레디스 저장
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

            

    } catch (e) {
        console.log('에러발생', e);
    }
};


const getSearchHistory = async (idx) => {
    try{
        const rs = await redisClient.zRange(`searchHistory${idx}`,0,-1,'WITHSCORES')
        
        return rs    

    }catch (e) {
        console.log('에러발생', e);
    }
}




module.exports = { recordSearchHistory,
                    getSearchHistory,
};
