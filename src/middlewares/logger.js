const { logModel } = require("../config/mongodb");


const logger = (req, res, next) => {
    const oldSend = res.send;
    res.send = (result) => {
        res.locals.result = result;

        return oldSend.apply(res, [result]);
    }

    res.on('finish', async () => {

        console.log("정상 로그생성 시작")
        // console.log("req : " , req)

        const logData = new logModel({
            method: req.method,
            url: req.url,
            path: req.path,
            userIP: req.ip,
            userID: req.session.userID,
            request: req.body,
            response: res.locals.result,
            status: req.statusCode,
            // errMessage: err.message
        })


        await logData.save();
        // console.log(logData.status)

        // console.log(logData)
    })
    next();
}

module.exports = { logger }
