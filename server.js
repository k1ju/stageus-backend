

const express = require('express');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session); // 세션을 db에 저장
const { pool } = require("./src/config/postgres");
const { logModel } = require("./src/config/mongodb");
const { logger } = require("./src/middlewares/logger")
require('dotenv').config();
const app = express();

// 로그호출 api는 기록안되게.
// 몽고db 연산자 공부


app.use(session({
    store: new pgSession({
        pool: pool,
        createTableIfMissing: true,
        schemaName: "class",
        tableName: 'user_session'
    }), // 세션을 db에 저장
    resave: true,
    saveUninitialized: true,
    secret: process.env.secretCode,
    cookie: {
        maxAge: 5 * 60 * 1000,
        rolling: true
    }
}));

app.use(express.json());


// const path = require("path");
// const fs = require("fs");
// const https = require("https");
// const options = {
//     "key": fs.readFileSync(path.join(__dirname, "./keys/key.pem")),
//     "cert": fs.readFileSync(path.join(__dirname, "./keys/cert.pem")),
//     // "ca": ca없으니 생략
//     "passphrase": "1234"
// }

// https: 실제배포 환경에서만
// app.get("*", (req, res, next) => {
//     const protocol = req.protocol;

//     if(protocol === "http"){
//         const dest = `https://${req.hostname}:8443${req.url}`
//         return res.redirect(dest)
//     };

//     next();
// })








//페이지api
const pageApi = require("./src/routers/page");
app.use("/", pageApi);

//계정api
const accountApi = require("./src/routers/account");

app.use("/account", logger, accountApi);

//게시글 api
const articleApi = require("./src/routers/article");
app.use("/article", logger ,articleApi);

//댓글 api
const commentApi = require("./src/routers/comment");
app.use("/comment", logger ,commentApi);

//log 기록 검색 api
const logApi = require("./src/routers/log");
app.use("/log", logApi)



app.use((err, req, res, next) => {

    if (!err.status) err.status = 500;

//     const logData = new logModel({
//         method: req.method,
//         url: req.url,
//         path: req.path,
//         userIP: req.ip,
//         userID: req.session.userID,
//         request: req.body,
//         response: res.locals.result,
//         status: req.statusCode,
//         errMessage: err.message
//     });
//     console.log("에러 로그기록 남기기")
//     logData.save();

    res.status(err.status).send({ message: err.message });
})


app.listen(process.env.port, '0.0.0.0', () => {
    console.log(`${process.env.port}번 포트번호 서버실행`)
    // logger.info(`${port}번 포트번호 서버실행222`)
})


// https.createServer(options, app).listen(process.env.httpsPort, () => {
//     console.log(`${process.env.port}번에서 HTTP웹 서버 시행`)
// })

