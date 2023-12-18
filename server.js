const express = require('express');
const session = require("express-session");

const app = express();
const port = 8000;

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

//최대한 분할해서 커밋하기
//노드 세션적용하기

//페이지api
const pageApi = require("./src/routers/page")
app.use("/",pageApi)

//계정api
const accountApi = require("./src/routers/account");
app.use("/account", accountApi);

//게시글 api
const articleApi = require("./src/routers/article");
app.use("/article",articleApi);

//댓글 api
const commentApi = require("./src/routers/comment");
app.use("/comment",commentApi);


app.listen(port, () => {
    console.log(`${port}번 포트번호 서버실행`)
})





















