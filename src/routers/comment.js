const router = require("express").Router();
const session = require("express-session");
const mysql = require("mysql");
const dbconfig = require("../../config/db.js");
require('dotenv').config();
const secretCode = process.env.secretCode;
router.use(session({
    resave:false,
    saveUninitialized:false,
    secret: secretCode
}));

//대댓글기능의 테이블 구조 다시 짜기

//댓글쓰기
router.post("/:articleIdx/:commentIdx", (req, res) => {
    const { content, useridx } = req.body;
    const { articleIdx, commentIdx } = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {

        if (!req.session.idx) { // 세션이 널값이라면
            throw new Error("세션없음");
        };
        //db통신

        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//댓글 불러오기
router.get("/:articleidx", (req, res) => {
    const articleidx = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {

        //db통신

        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//댓글수정하기
router.put("/:commentidx", (req, res) => {
    const commentidx = req.params;
    const content = req.body;
    const result = {
        "success": false,
        "message": "실패"
    };

    try {
        if (!req.session.idx) { // 세션이 널값이라면
            throw new Error("세션없음")
        };
        if (req.session.idx !== userIdx) {
            throw new Error("사용자 idx가 불일치")
        };

        //db통신

        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//댓글삭제하기
router.delete("/:userIdx/:commentIdx", (req, res) => {
    const { userIdx, commentIdx } = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }

    try {
        if (!req.session.idx) { // 세션이 널값이라면
            throw new Error("세션없음")
        };
        if (req.session.idx !== userIdx) {
            throw new Error("사용자 idx가 불일치")
        }
        //db통신

        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

module.exports = router;
