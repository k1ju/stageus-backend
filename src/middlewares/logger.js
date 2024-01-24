const { logModel } = require("../config/mongodb");


const logger = (req, res, next) => {

    // const oldSend = res.send;
    // res.send = (result) => {
    //     res.locals.result = result;
    //     return oldSend.apply(res, [result]);
    // }

    res.on('finish', async () => {
        console.log("로그기록 시작")

        const logData = new logModel({
            method: req.method,
            url: req.url,
            userIP: req.ip,
            // userID: req.user.userID,
            request: req.body,
            response: res.locals.result,
            status: res.statusCode,
            errMessage: res.locals.message // 스택트레이스도 넣기!
        })

        console.log("로그생성완료");
        // console.log(logData)

        logData.save();


    })
    next();
}

module.exports = { logger }
