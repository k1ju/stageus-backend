
const express = require('express');
const session = require("express-session");
require('dotenv').config();
const { secretCode, port } = process.env; // .env로부터 환경변수 불러오기
const app = express();

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: secretCode,
    cookie: {
        maxAge: 5 * 60 * 1000,
        rolling: true
    }
}));
//next 에러핸들링
// 익스프레스 쓰레기통
// 모든api에대한 후처리를 한곳에서 가능

app.use(express.json());



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


app.use((err, req, res, next) => {

    if (!err.status) err.status = 500;
    
    res.status(err.status).send({ message: err.message });
})






app.listen(port, () => {
    console.log(`${port}번 포트번호 서버실행`)
})

