const router = require("express").Router();
const session = require("express-session");
// mysql db 연결,쿼리실행 모듈 import
const mysql = require("mysql");
// db세부정보 import
const dbconfig = require('../../config/db.js');

require('dotenv').config();
const secretCode = process.env.secretCode;
router.use(session({
    resave: false,
    saveUninitialized: false,
    secret: secretCode
}));

//게시글 목록 불러오기route
router.get("/all", (req, res) => {
    const result = {
        "success": false,
        "message": "실패",
        "data": []
    }
    try {

        //db통신
        // db연결객체 생성
        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT a.idx, title, write_date, u.name FROM article a JOIN account u ON a.user_idx = u.idx ";

        conn.query(sql, (err, rs) => {
            try {
                if (err) throw new Error("db 에러");
                if (rs.length == 0) throw new Error("게시글없음");

                rs.forEach((elem) => {
                    let data = [elem.idx, elem.title, elem.write_date, elem.name];
                    result.data.push(data);
                })

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
//게시글 작성하기
router.post("/:userIdx", (req, res) => {
    const { title, content } = req.body;
    const userIdx = req.params.userIdx;
    const result = {
        "success": false,
        "message": "실패"
    }

    try {
        if (!req.session.idx) { // 세션이 널값이라면
            throw new Error("세션없음")
        };
        //db통신
        const conn = mysql.createConnection(dbconfig);
        const sql = "INSERT INTO article(title,content,user_idx) VALUES (?,?,?) ";
        const values = [title, content, userIdx];

        conn.query(sql, values, (err) => {
            try {
                if (err) throw new Error("db 에러");

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
router.put("/:articleIdx", (req, res) => {
    const { userIdx, title, content } = req.body;
    const articleIdx = req.params.articleIdx;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        if (!req.session.idx) throw new Error("세션없음");
        if (req.session.idx !== userIdx) throw new Error("사용자 idx가 불일치");

        const conn = mysql.createConnection(dbconfig);
        const sql = "UPDATE article SET title = ?, content = ? WHERE idx = ?";
        const values = [title, content, articleIdx];
        //db통신
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");

                result.success = true;
                result.message = rs.affectedRows + "개 데이터 성공"; // rs.affectedRows : insert, update, delete 의 데이터 개수 반환

            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
    }
})
//게시글 삭제하기
router.delete("/:articleIdx", (req, res) => {
    const userIdx = req.body.userIdx;
    const articleIdx = req.params.articleIdx;
    //idx 패스파라미터
    const result = {
        "success": false,
        "message": "실패"
    }

    try {
        if (!req.session.idx) throw new Error("세션없음")
        if (req.session.idx !== userIdx) throw new Error("사용자 idx가 불일치")

        const sql = "DELETE FROM article WHERE idx = ?";
        const values = [articleIdx];
        const conn = mysql.createConnection(dbconfig); // db연결
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");

                result.success = true;
                result.message = rs.affectedRows + "개 데이터 성공"; // rs.affectedRows : insert, update, delete 의 데이터 개수 반환

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
//게시글 자세히보기
router.get("/:articleIdx", (req, res) => {
    const articleIdx = req.params.articleIdx;
    const result = {
        "success": false,
        "message": "실패",
        "data": []
    }

    try {
        const sql = "SELECT a.idx, a.title, a.content, a.write_date, u.name FROM article a JOIN account u ON a.user_idx = u.idx WHERE a.idx = ?";
        const values = [articleIdx];
        const conn = mysql.createConnection(dbconfig); // db연결
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                rs.forEach((elem) => {
                    const articleData = [elem.idx, elem.title, elem.content, elem.write_date, elem.name];
                    result.data.push(articleData);
                })
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

module.exports = router;