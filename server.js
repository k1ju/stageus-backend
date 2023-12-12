const express = require('express');
const app = express();
const port = 8000;
const db = require("/src/db");

//최대한 분할해서 커밋하기

// 회원가입 api
// api이름적기, req,res 매개변수의 함수적기
app.post('/account', (req, res) => {
    const { userID, userPw, userPwCheck, userName, userPhonenumber } = req.body;

    const result={
        "success":false,
        "message":"회원가입실패"
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
        return;
        res.send(result);
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
    const{userID,userPw} = req.body;

})

//id찾기
//비밀번호찾기
//내정보보기
//정보수정
//회원탈퇴
//게시글 목록 불러오기
//게시글 작성하기
//게시글 수정하기
//게시글 삭제하기
//게시글 자세히보기
//댓글쓰기
//댓글 읽기
//댓글수정하기
//댓글삭제하기






app.listen(port, () => {
    console.log(`${PORT}번 포트번호 서버실행`)
})






















