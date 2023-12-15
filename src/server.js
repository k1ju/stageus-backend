const express = require('express');
const session = require("express-session");

const app = express();
const port = 8000;

app.use(session({
    resave: false,
    saveUninitialized: false,
    // secret:process.env.COOKIE_SECRET,
    secret: "secret",
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

//최대한 분할해서 커밋하기
//게시글-쿼리스트링, 댓글 - 패스파라미터 반영
//노드 세션적용하기

// 회원가입 api
app.post('/account', (req, res) => {
    const { userID, userPw, userPwCheck, userName, userPhonenumber } = req.query;

    const result = {
        "success": false,
        "message": "회원가입실패"
    }

    userIDRegex = /^\w[\w\d!@#$%^&*()_+{}|:"<>?/-]{1,19}$/;
    userPwRegex = /^(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-]){1,20}$/;
    userNameRegex = /^[가-힣]{2,5}$/;
    userPhonenumberRegex = /^[0-9]{10,12}$/;

    if (!userIDRegex.test(userID)) {
        result.message = "아이디 글자제한";
        res.send(result);
        return;
    }
    if (!userPwRegex.test(userPw)) {
        result.message = "비번 글자제한";
        res.send(result);
        return;
    }
    if (!userNameRegex.test(userName)) {
        result.message = "이름 글자제한 2~5글자";
        res.send(result);
        return;
    }
    if (!userPhonenumberRegex.test(userPhonenumber)) {
        result.message = "전화번호 형식제한 숫자 10~12글자";
        res.send(result);
        return;
    }
    if (userPw != userPwCheck) {
        result.message = "비밀번호확인 불일치";
        res.send(result);
        return;
    }

    result.success = true;
    result.message = "회원가입성공";
    res.send(result);
})

// 로그인 api
app.get("/account", (req, res) => {
    const { userID, userPw } = req.query;
    const result = {
        "success": false,
        "message": "로그인실패",
        "session": ""
    }
    if (!req.session.user) {
        req.session.user = {
            userIdx: "idx",
            userID: "id",
            userPw: "pw",
            username: "userName"
        }
    };
    if (results.length > 0) {
        result.success = true;
        result.message = "로그인성공";
        result.session = req.session.test
    }
    res.send(result);
})
//로그아웃
app.delete("/session", (req, res) => {
    req.session.destroy;

})


//id찾기
app.get("/account/id", (req, res) => {
    const { userName, userPhonenumber } = req.query;
    const result = {
        "success": false,
        "message": "id찾기실패",
        "id": ""
    }
    result.success = true;
    result.message = "id찾기성공";
    result.id = "id";
    res.send(result)
})
//비밀번호찾기
app.get("/account/pw", (req, res) => {
    const { userName, userPhonenumber } = req.query;
    const result = {
        "success": false,
        "message": "pw찾기실패",
        "pw": ""
    }
    result.success = true;
    result.message = "pw찾기성공";
    result.pw = "pw";
    res.send(result)
})
//내정보보기
app.get("/account/info", (req, res) => {
    const { idx } = req.body;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//정보수정
app.put("/account", (req, res) => {
    const { idx, userName, userPhonenumber, userPosition, userTeam } = req.query;
    const result = {
        "success": false,
        "message": "수정실패",
    }

    result.success = true;
    result.message = "변경성공";
    result.send(result);
})
//회원탈퇴
app.delete("/account", (req, res) => {

    const idx = req.query.idx
    const result = {
        "success": false,
        "message": "탈퇴실패",
    }
    result.success = true;
    result.message = "탈퇴성공";
    res.send(result);

})


//게시글,쿼리스트링
//게시글 목록 불러오기
app.get("/article", (req, res) => {
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//게시글 작성하기
app.post("/article", (req, res) => {
    const { userIdx, title, content } = req.query;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);

})
//게시글 수정하기
app.put("/article", (req, res) => {
    const { articleIdx, title, content } = req.query;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//게시글 삭제하기
app.delete("/article", (req, res) => {
    const idx = req.query.idx;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//게시글 자세히보기
app.get("/article", (req, res) => {
    const { idx: articleIdx, title: title, content: content } = req.query;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//댓글,패스파라미터
//댓글쓰기
app.post("/comment/:articleidx/:content/:useridx", (req, res) => {
    const { articleidx, content, useridx } = req.params
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//댓글 읽기
app.get("/comment/:articleidx", (req, res) => {
    const articleidx = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }

    res.send(result.rows)
})
//댓글수정하기
app.put("/comment/:commentidx/:content", (req, res) => {
    const { commentidx, content } = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//댓글삭제하기
app.delete("/comment/:commentidx", (req, res) => {
    const commentidx = req.params.idx;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})

app.listen(port, () => {
    console.log(`${port}번 포트번호 서버실행`)
})





















