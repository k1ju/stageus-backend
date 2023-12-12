const express = require('express');
const mysql = require("mysql");
const db = require("/src/db");
const url = require("url");
const { request } = require('http');
const app = express();
const port = 8000;
const connection = mysql.createConnection(db);


//최대한 분할해서 커밋하기
//게시글-쿼리스트링, 댓글 - 패스파라미터 반영
//노드 세션적용하기


// 회원가입 api
// api이름적기, req,res 매개변수의 함수적기
app.post('/account', (req, res) => {
    const { userID, userPw, userPwCheck, userName, userPhonenumber } = req.body;

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
    const { userID, userPw } = req.body;

    const result = {
        "success": false,
        "message": "로그인실패"
    }
    let query = "SELECT idx FROM account WHERE id = ? AND pw = ? ";

    connection.query(query, [userID, userPw], (error, results) => {
        if (error) {
            res.send(result);
            return;
        }
        if (results.length > 0) {
            result.success = true;
            result.message = "로그인성공";
        }
        
        res.send(result);

    })
})
//로그아웃



//id찾기
app.get("/account/id")
//비밀번호찾기
//내정보보기
app.get("/account/:idx", (req, res) => {
    const {userIdx} = req.body;
    let query = "SELECT * FROM account WHERE idx = ?";

    const result = {
        "success": false,
        "message": "실패"
    }

    connection.query(query, [userIdx], (error, results) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);

    })
})
//정보수정
//회원탈퇴
app.delete("/account", (req, res) => {

    const userIdx = req.body
    let deleteQquery = "DELETE FROM account WHERE idx = ?";

    const result = {
        "success": false,
        "message": "실패"
    }

    connection.query(query, [userIdx], (error, results) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "탈퇴성공";
        res.send(result);
    })
})

//게시글,쿼리스트링
//게시글 목록 불러오기
app.get("/article", (req, res) => {
    const {}
    const query = "SELECT * FROM article ";
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query,, (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })
})
//게시글 작성하기
app.post("/article/:idx", (req, res) => {
    const { userIdx, title, content } = req.body;
    const query = "INSERT INTO article(user_idx,title,value) VALUES(?,?,?) ";
    const result = {
        "success": false,
        "message": "실패"
    }

    connection.query(query, [userIdx, title, content], (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })

})
//게시글 수정하기
//쿼리스트링
app.put("/article", (req, res) => {
    const { userIdx, title, content } = req.query;
    const query = "UPDATE article SET title = ?, content = ? WHERE user_idx = ?";
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query, [title, content, articleIdx], (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })
})
//게시글 삭제하기
//패스파라미터
app.delete("/article/:idx", (req, res) => {
    const articleIdx = req.params;
    const query = "DELETE * FROM article WHERE idx = ?";
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query, [articleIdx], (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })
})
//게시글 자세히보기
app.get("/article?idx", (req, res) => {
    const query = "SELECT * FROM article WHERE idx = ?";
    const queryData = url.parse(request.url,true).query
    const articleIdx = queryData.idx;
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query, [articleIdx], (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })
})
//댓글,패스파라미터
//댓글쓰기
app.post("/comment", (req, res) => {
    const { articleIdx, content } = req.body;
    const query = "INSERT INTO comment(content,article_idx) VALUES (?,?)";
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query, [articleIdx], (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })
})
//댓글 읽기
app.get("/comment/:articleIdx", (req, res) => {
    const articleIdx = req.body;
    const query = "SELECT * FROM comment WHERE article_idx = ?"
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query, [articleIdx], (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        res.send(result.rows)
    })
})
//댓글수정하기
app.put("/comment/:idx", (req, res) => {
    const { idx, content } = req.body;
    const query = "UPDATE comment SET content = ? WHERE idx = ? ";
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query, [idx, content], (error, result) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })
})
//댓글삭제하기
app.delete("/comment/:idx", (req, res) => {
    const { idx } = req.body;
    const query = "DELETE comment WHERE idx = ?";
    const result = {
        "success": false,
        "message": "실패"
    }
    connection.query(query, [idx], (req, res) => {
        if (error) {
            res.send(result);
            return;
        }
        result.success = true;
        result.message = "성공";
        res.send(result);
    })
})

app.listen(port, () => {
    console.log(`${PORT}번 포트번호 서버실행`)
})






















