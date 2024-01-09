
const express = require('express');
const session = require("express-session");
const logger = require("./src/config/logger");
const { Log } = require("./src/config/mongodb");
require('dotenv').config();

const path = require("path");
const fs = require("fs");
const https = require("https");
const app = express();
const options = {
    "key": fs.readFileSync(path.join(__dirname, "./keys/key.pem")),
    "cert": fs.readFileSync(path.join(__dirname, "./keys/cert.pem")),
    // "ca": ca없으니 생략
    "passphrase": "1234"
}

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.secretCode,
    cookie: {
        maxAge: 5 * 60 * 1000,
        rolling: true
    }
}));

app.use(express.json());

app.get("*", (req, res, next) => {
    const protocol = req.protocol;

    if(protocol === "http"){
        const dest = `https://${req.hostname}:8443${req.url}`
        return res.redirect(dest)
    };
    
    next();
})


//로깅 직접만들기
// app.use((req, res, next) => {
//     const oldSend = res.send;
//     res.send = (result) => {
//         res.locals.result = result;

//         return oldSend.apply(res, [result]);
//     }

//     res.on('finish', async () => {

//         console.log("로그생성 시작")

//         const logData = new Log({
//             method: req.method,
//             url: req.url,
//             userIP: req.ip,
//             userID: req.session.userID,
//             request: req.body,
//             response: res.locals.result,
//             status: req.status
//         })

//         await logData.save();
//         console.log(logData.status)
        
//         console.log(logData)
//     })
//     next();
// })


//winston 로깅
// app.use((req, res, next) => {

//     const logInfo = {
//         method: req.method,
//         route: req.url,
//         userIP: req.ip,
//         userID: req.session.userID || null,
//         request: req.body || {},
//         response: res.body || {},
//     }
//     // console.log(logInfo)

//     logger.info('API 요청:', { metadata: logInfo });
//     next();
// })




//페이지api
const pageApi = require("./src/routers/page");
app.use("/", pageApi);

//계정api
const accountApi = require("./src/routers/account");
app.use("/account", accountApi);

//게시글 api
const articleApi = require("./src/routers/article");
app.use("/article", articleApi);

//댓글 api
const commentApi = require("./src/routers/comment");
app.use("/comment", commentApi);

//log 기록 검색 api
const logApi = require("./src/routers/log");
app.use("/log", logApi)



app.use((err, req, res, next) => {

    if (!err.status) err.status = 500;

    res.status(err.status).send({ message: err.message });
})


app.listen(process.env.port, '0.0.0.0', () => {
    console.log(`${process.env.port}번 포트번호 서버실행`)
    // logger.info(`${port}번 포트번호 서버실행222`)
})


https.createServer(options, app).listen(process.env.httpsPort, () => {
    console.log(`${process.env.port}번에서 HTTP웹 서버 시행`)
})

