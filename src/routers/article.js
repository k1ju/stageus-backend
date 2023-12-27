const router = require("express").Router();
const mysql = require('mysql');
const dbconfig = require('../../config/db.js');
const regexPattern = require("../modules/regexPattern.js");


//게시글 목록 불러오기route
router.get("/all", (req, res) => {
    const result = {
        "success": false,
        "message": "실패",
        "data":{
            "article": null //data로 바꾸기
        }
    }
    try {
        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT a.idx, title, write_date, u.name FROM article a JOIN account u ON a.user_idx = u.idx ORDER BY a.idx"; //orderby는 idx로하기!
        conn.query(sql, (err, rs) => { //rs는 원래 리스트
            try {
                if (err) throw new Error("db 에러");
                if (rs.length == 0) throw new Error("게시글없음");
                result.data.article = rs;
            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result);
            }
        })
        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})
//게시글 자세히보기
router.get("/:articleidx", (req, res) => {
    const articleidx = req.params.articleidx;
    const result = {
        "success": false,
        "message": "실패",
        "data":{
            "article": null
        }

    }
    try {
        regexPattern.nullCheck(articleidx)
        const sql = "SELECT a.idx, a.title, a.content, a.write_date, u.name FROM article a JOIN account u ON a.user_idx = u.idx WHERE a.idx = ?";
        const values = [articleidx];
        const conn = mysql.createConnection(dbconfig); // db연결
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                result.data.article = rs;
                result.success = true;
                result.message = "성공";
            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})
//게시글 작성하기
router.post("/", (req, res) => {
    const { useridx, title, content } = req.body;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        // if (!req.session.idx) throw new Error("세션없음");
        regexPattern.nullCheck(useridx)
        regexPattern.nullCheck(title)
        regexPattern.nullCheck(content);
        const conn = mysql.createConnection(dbconfig);
        const sql = "INSERT INTO article(title,content,user_idx) VALUES (?,?,?) ";
        const values = [title, content, useridx];
        conn.query(sql, values, (err) => {
            try {
                if (err) throw new Error("db 에러");
                result.success = true;
                result.message = "성공";
            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result);
            }
        })
        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})
//게시글 수정하기
router.put("/:articleidx", (req, res) => {
    const { useridx, title, content } = req.body;
    const articleidx = req.params.articleidx;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        // if (req.session.idx !== useridx) throw new Error("사용자 idx가 불일치"); //유저 idx db전에도 검사
        regexPattern.nullCheck(useridx)
        regexPattern.nullCheck(title)
        regexPattern.nullCheck(content);
        regexPattern.nullCheck(articleidx)
        const conn = mysql.createConnection(dbconfig);
        const sql = "UPDATE article SET title = ?, content = ? WHERE idx = ? AND user_idx = ?"; //db에서도 유저 idx검사
        const values = [title, content, articleidx, useridx];
        //db통신
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                result.success = true;
                result.message = rs.affectedRows + "개 수정"; // rs.affectedRows : insert, update, delete 의 데이터 개수 반환
            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})
//게시글 삭제하기
router.delete("/:articleidx", (req, res) => {
    const useridx = req.body.useridx;
    const articleidx = req.params.articleidx;
    //idx 패스파라미터
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        //if (req.session.idx !== useridx) throw new Error("사용자 idx가 불일치")
        regexPattern.nullCheck(useridx)
        regexPattern.nullCheck(articleidx)
        const sql = "DELETE FROM article WHERE idx = ? AND user_idx = ?";
        const values = [articleidx, useridx];
        const conn = mysql.createConnection(dbconfig); // db연결
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                result.success = true;
                result.message = rs.affectedRows + "개 삭제"; // rs.affectedRows : insert, update, delete 의 데이터 개수 반환
            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})

module.exports = router;