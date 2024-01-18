const redis = require('redis').createClient();


//00:00마다 실행될코드
//db에 날짜, 방문자수 저장, 없으면 패스

const VisitorSave = async() => {

    
}


// webVisitor 키 생성
// 로그인할때마다 webVisitor 1씩추가, set이용


const visitorCount = async (userID) => {
    console.log("방문자 카운트 시작")

    try{
        await redis.connect();

        const today = new Date().toISOString().slice(0,10)

        await redis.sAdd(`visitor${today}`, `${userID}`)

        // const num = await redis.sCard(`visitor${today}`)
        // const expireTime =  
        // console.log(num)


        // if(num ==1){
        //     console.log("만료시간 설정")
        //     redis.expireat(`visitor${today}`, expireTime)
        // }


        console.log("방문자 카운트 완료")
        redis.disconnect()

    } catch (e) {
        console.log("에러발생")
    }
}


module.exports = {
    visitorCount
}