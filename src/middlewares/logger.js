const { logModel } = require('../config/mongodb');

console.log("currentDate :", new Date().toISOString());


const logger = async (req, res, next) => {

    res.on('finish', async () => {
        console.log('로그 기록 시작');
        const logData = new logModel({
            method: req.method,
            url: req.url,
            userIP: req.ip,
            // userID: req.user.userID,
            request: req.body,
            response: res.locals.result, 
            status: res.statusCode,
            errMessage: res.locals.message,
            timestamp: new Date()
        });
        console.log("logData : ", logData);
        console.log("currentDate :", new Date().toISOString());

        logData.save();

    });
    next();
};

module.exports = { logger };
