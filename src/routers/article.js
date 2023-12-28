const router = require("express").Router();
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');
const pattern = require("../modules/pattern.js");

//게시글 목록 불러오기route
router.get("/all", (req, res) => {
    const result = {
        "success": false,
        "message": "",
        "data":{
            "article": null //성공여부, 메시지 이외의 데이터는 데이터 항목에 넣어주기
        }
    }

    try {
        const sql = "SELECT a.idx, title, write_date, u.name FROM class.article a JOIN class.account u ON a.user_idx = u.idx ORDER BY a.idx"; //orderby는 idx로하기!
        const pool = new Pool(dbconfig);

        pool.query(sql, (err, rs) => { //rs는 객체, rs.rows는 리스트로 반환??
            try {
                if (err) throw new Error("db 에러");
                if (rs.rows.length == 0) throw new Error("게시글없음"); // 이건되고
                // if (rs.length == 0) throw new Error("게시글없음"); // 이건 안되는이유  => rs는 객체이고 rs.rows는 배열.

                result.data.article = rs.rows;
                result.success = true;
            } catch (e) {
                result.message = e.message;
            } finally {
                res.send(result);
            }
        })
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
        "message": "",
        "data":{
            "article": null
        }
    }

    try {
        pattern.nullCheck(articleidx)

        const sql = "SELECT a.idx, a.title, a.content, a.write_date, u.name FROM class.article a JOIN class.account u ON a.user_idx = u.idx WHERE a.idx = $1";
        const values = [articleidx];
        const pool = new Pool(dbconfig);

        pool.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error("db에러");
                result.data.article = rs.rows;  
                result.success = true;
            } catch (e) {
                result.message = e.message;
            } finally {
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
    const { title, content } = req.body;
    const useridx = req.session.idx
    const result = {
        "success": false,
        "message": ""
    }
    try {

        pattern.nullCheck(useridx)
        pattern.nullCheck(title)
        pattern.nullCheck(content);

        const sql = "INSERT INTO class.article(title,content,user_idx) VALUES ($1, $2, $3) ";
        const values = [title, content, useridx];
        const pool = new Pool(dbconfig);

        pool.query(sql, values, (err) => {
            try {
                if (err) throw new Error("db 에러");
                result.success = true;
            } catch (e) {
                result.message = e.message;
            } finally {
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})
//게시글 수정하기
router.put("/:articleidx", (req, res) => {
    const {title, content } = req.body;
    const useridx = req.session.idx
    const articleidx = req.params.articleidx;
    const result = {
        "success": false,
        "message": ""
    }
    try {
        // if (!req.session.idx) throw new Error("세션없음");

        pattern.nullCheck(useridx);
        pattern.nullCheck(title);
        pattern.nullCheck(content);
        pattern.nullCheck(articleidx);

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
    const useridx = req.session.idx;
    const articleidx = req.params.articleidx;
    //idx 패스파라미터
    const result = {
        "success": false,
        "message": ""
    }
    try {
        // if (!req.session.idx) throw new Error("세션없음");

        pattern.nullCheck(useridx)
        pattern.nullCheck(articleidx)

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