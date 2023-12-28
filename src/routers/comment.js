const router = require("express").Router();
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');
const pattern = require("../modules/pattern.js");


//댓글쓰기
router.post("/", (req, res) => {
    const { articleidx, content, useridx } = req.body;
    const result = {
        "success": false,
        "message": ""
    }
    try {
        //if (!req.session.idx) throw new Error("세션없음");
        pattern.nullCheck(articleidx);
        pattern.nullCheck(content);
        pattern.nullCheck(useridx);

        const sql = "INSERT INTO comment(content, user_idx, article_idx) VALUES (?,?,?) ";
        const values = [content, useridx, articleidx];
        const conn = mysql.createConnection(dbconfig);
        conn.query(sql, values, (err) => {
            try {
                if (err) throw new Error("db에러");
                result.success = true;
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
router.get("/", (req, res) => {
    const articleidx = req.query.articleidx;
    const result = {
        "success": false,
        "message": "",
        "data":{
            "comment": null
        }
    };
    try {
        pattern.nullCheck(articleidx);

        const sql = "SELECT c.idx, content, write_date, name FROM comment c JOIN account u ON c.user_idx = u.idx WHERE article_idx = ? ORDER BY c.idx ";
        const values = [articleidx];
        const conn = mysql.createConnection(dbconfig);

        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러"); // rs는 이미 리스트
                result.data.comment = rs;
                result.success = true;
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
router.put("/:commentidx", (req, res) => {
    const commentidx = req.params.commentidx;
    const useridx = req.session.idx
    const { content } = req.body;
    const result = {
        "success": false,
        "message": ""
    };

    try {
        //if (!req.session.idx) throw new Error("세션없음");

        pattern.nullCheck(commentidx);
        pattern.nullCheck(content);
        pattern.nullCheck(useridx);

        const sql = "UPDATE comment SET content = ? WHERE idx = ? AND user_idx = ? ";
        const values = [content, commentidx, useridx];
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
router.delete("/:commentidx", (req, res) => {

    const commentidx = req.params.commentidx;
    const useridx = req.session.idx;
    const result = {
        "success": false,
        "message": ""
    }

    try {
        // if (!req.session.idx) throw new Error("세션없음")

        pattern.nullCheck(commentidx);
        pattern.nullCheck(useridx);

        const sql = "DELETE FROM comment WHERE idx = ? AND user_idx = ? ";
        const values = [commentidx, useridx];
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




