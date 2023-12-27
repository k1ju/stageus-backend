
const express = require('express');
const session = require("express-session");
require('dotenv').config();
const { secretCode, port } = process.env; // .env로부터 환경변수 불러오기
const app = express();

//postgreSQL 연결
// const mysql = require('mysql');
// const dbconfig = require('./config/db.js');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: secretCode,
    cookie: {
        maxAge: 5 * 60 * 1000,
        rolling:true
    }
}));


app.use(express.json());

//최대한 분할해서 커밋하기

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


app.listen(port, () => {
    console.log(`${port}번 포트번호 서버실행`)
})

