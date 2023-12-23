const router = require("express").Router();
const session = require("express-session");
const mysql = require("mysql");
const dbconfig = require("../../config/db.js");
require('dotenv').config();
const secretCode = process.env.secretCode;
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: secretCode,
    cookie: {
        maxAge: 5 * 60 * 1000,
        rolling:true
    }
}));


//댓글쓰기
router.post("/:articleIdx", (req, res) => {
    const { content, userIdx } = req.body;
    const articleIdx = req.params.articleIdx;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        //if (!req.session.idx) throw new Error("세션없음");
        const sql = "INSERT INTO comment(content, user_idx, article_idx) VALUES (?,?,?) ";
        const values = [content, userIdx, articleIdx];
        const conn = mysql.createConnection(dbconfig);
        conn.query(sql, values, (err) => {
            try {
                if (err) throw new Error("db에러");
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
//댓글 불러오기
router.get("/:articleIdx", (req, res) => {
    const articleIdx = req.params.articleIdx;
    const result = {
        "success": false,
        "message": "실패",
        "comment": []
    };
    try {
        const sql = "SELECT c.idx, content, write_date, name FROM comment c JOIN account u ON c.user_idx = u.idx WHERE article_idx = ? ORDER BY write_date ";
        const values = [articleIdx];
        const conn = mysql.createConnection(dbconfig);
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                rs.forEach(elem => {
                    let commentData = [elem.idx, elem.content, elem.write_date, elem.name];
                    result.comment.push(commentData);
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
//댓글수정하기
router.put("/:commentIdx", (req, res) => {
    const commentIdx = req.params.commentIdx;
    const { content, userIdx } = req.body;
    const result = {
        "success": false,
        "message": "실패"
    };
    try {
        //if (!req.session.idx) throw new Error("세션없음");
        //if (req.session.idx !== userIdx) throw new Error("사용자 idx가 불일치");
        const sql = "UPDATE comment SET content = ? WHERE idx = ? ";
        const values = [content, commentIdx];
        const conn = mysql.createConnection(dbconfig);
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                result.success = true
                result.message = rs.affectedRows + "개 수정";
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
//댓글삭제하기
router.delete("/:commentIdx", (req, res) => {
    const commentIdx = req.params.commentIdx;
    const userIdx = req.body.userIdx;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        // if (!req.session.idx) throw new Error("세션없음")
        // if (req.session.idx !== userIdx) throw new Error("사용자 idx가 불일치")
        const sql = "DELETE FROM comment WHERE idx = ? ";
        const values = [commentIdx];
        const conn = mysql.createConnection(dbconfig);
        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                result.success = true
                result.message = rs.affectedRows + "개 삭제";
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




