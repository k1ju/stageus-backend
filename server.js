
const express = require('express');
const session = require("express-session");
const morgan = require('morgan');
const logger = require("./logger");
const { ApiLog } = require("./src/config/db");
require('dotenv').config();
const { secretCode, port, } = process.env; // .env로부터 환경변수 불러오기
const app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secretCode,
    cookie: {
        maxAge: 5 * 60 * 1000,
        rolling: true
    }
}));

app.use(express.json());




// log기록 기능 개발하기
// 호출자ip주소, 호출자id,m api명, 프엔이 보낸값, 반환값, 해당로그가 기입된시간
// app.use('/', async (req, res, next) => {

//     const apiLog = new ApiLog({
//         method: req.method,
//         route: req.url,
//         userIP: req.ip,
//         userID: req.session.userID,
//         request: req.body,
//         response: null
//     })

//     await apiLog.save();

//     const originalSend = res.send;
//     res.send = function (body) {
//         apiLog.response = body;
//         return originalSend.apply(res, arguments);
//     };

//     next();
// })



app.use(morgan('combined'));
// app.use(morgan('dev'));

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






app.listen(port, () => {
    console.log(`${port}번 포트번호 서버실행`)
})

