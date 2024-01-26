const redisClient = require('../config/redis');
const { pool } = require('../config/postgres');
const schedule = require('node-schedule');

const rule = new schedule.RecurrenceRule();

rule.minute = 0;
rule.tz = ''


//00:00마다 실행될코드
//db에 날짜, 방문자수 저장, 없으면 패스

const visitorSave = async () => {

    const today = new Date().toISOString().slice(0, 10); // 오늘날짜

    const visitorList = await redisClient.sMembers(`visitor`);
    console.log('현재 방문자 리스트', visitorList);
        
    visitorList.forEach(async (elem) => {

        await pool.query(
            `INSERT INTO class.visitor(visit_date, user_idx) VALUES ($1, $2)`,
            [today, elem]
        );
    })

    redisClient.del(`visitor`);

};

// webVisitor 키 생성
// 로그인할때마다 webVisitor 1씩추가, set이용

const visitorCount = async (userIdx) => {

    try {
        await redisClient.sAdd(`visitor`, `${userIdx}`);

    } catch (e) {
        console.log('에러발생', e);
    }
};


const job = schedule.scheduleJob('0 0 * * * *', visitorSave)


module.exports = {
    visitorCount,
    visitorSave
};
