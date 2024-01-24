const redisClient = require('../config/redis');
const { pool } = require('../config/postgres');

//00:00마다 실행될코드
//db에 날짜, 방문자수 저장, 없으면 패스

const VisitorSave = async (userIdx, userIP) => {

    const today = new Date().toISOString().slice(0, 10); // 오늘날짜

    redisClient.expire(`visitor${today}`, 3600);

    await pool.query(
        `INSERT INTO class.visitor(visit_date, user_idx, user_ip) VALUES ($1, $2, $3) `,
        [today, userIdx, userIP]
    );




};

// webVisitor 키 생성
// 로그인할때마다 webVisitor 1씩추가, set이용

const visitorCount = async (userIdx, userIP) => {
    console.log('userIP: ', userIP);
    console.log('userIdx: ', userIdx);

    try {
        const today = new Date().toISOString().slice(0,10)

        await redisClient.del(`visitor_info${today}`)

        const timestamp = new Date().getTime()
        console.log('today: ', today);
        console.log('timestamp: ', timestamp);

        await redisClient.hSet(`visitor_info${today}`, {
            timestamp :timestamp,
            visitor_idx: userIdx, 
            visitor_ip: userIP
        });
        
        const result = await redisClient.hGetAll(`visitor_info${today}`);
        console.log('result: ', JSON.stringify(result));


        // const num = await redisClient.sCard(`visitor${today}`);


    } catch (e) {
        console.log('에러발생', e);
    }
};

module.exports = {
    visitorCount,
};
