const router = require("express").Router();
const mysql = require('mysql');
const dbconfig = require('../../config/db.js');

//게시글 목록 불러오기route
router.get("/all", (req, res) => {
    const result = {
        "success": false,
        "message": "실패",
        "data":{
            "article": [] //data로
        }
    }
    try {
        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT a.idx, title, write_date, u.name FROM article a JOIN account u ON a.user_idx = u.idx ORDER BY write_date"; //orderby는 idx로하기!
        conn.query(sql, (err, rs) => { //rs는 원래 리스트
            try {
                if (err) throw new Error("db 에러");
                if (rs.length == 0) throw new Error("게시글없음");
                // rs.forEach((elem) => {
                //     let data = [elem.idx, elem.title, elem.write_date, elem.name];
                //     result.article.push(data);
                // })
                result.article = rs;
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
router.post("/", (req, res) => {
    const { userIdx, title, content } = req.body;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        if (!req.session.idx) throw new Error("세션없음");
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
        if (req.session.idx !== userIdx) throw new Error("사용자 idx가 불일치");
        const conn = mysql.createConnection(dbconfig);
        const sql = "UPDATE article SET title = ?, content = ? WHERE idx = ? AND user_idx = ?";
        const values = [title, content, articleIdx, userIdx];
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
router.delete("/:articleIdx", (req, res) => {
    const userIdx = req.body.userIdx;
    const articleIdx = req.params.articleIdx;
    //idx 패스파라미터
    const result = {
        "success": false,
        "message": "실패"
    }
    try {
        //if (req.session.idx !== userIdx) throw new Error("사용자 idx가 불일치")
        const sql = "DELETE FROM article WHERE idx = ? AND user_idx = ?";
        const values = [articleIdx, userIdx];
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
//게시글 자세히보기
router.get("/:articleIdx", (req, res) => {
    const articleIdx = req.params.articleIdx;
    const result = {
        "success": false,
        "message": "실패",
        "article": []
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
                    result.article.push(articleData);
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