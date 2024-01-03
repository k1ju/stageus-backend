const router = require("express").Router();
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');
const pattern = require("../modules/pattern.js");

//게시글 목록 불러오기route
router.get("/all", async (req, res) => {
    const result = {
        "success": false,
        "message": "",
        "data": {
            "article": null //성공여부, 메시지 이외의 데이터는 데이터 항목에 넣어주기
        }
    }

    try {
        const sql = "SELECT a.idx, title, write_date, u.name FROM class.article a JOIN class.account u ON a.user_idx = u.idx ORDER BY a.idx"; //orderby는 idx로하기!
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql)
        if (rs.rowCount == 0) throw new Error("게시글없음");
        // rs.rows : select 결과 반환
        // rs.affectedRows : insert, update, delete 의 데이터 개수 반환 (mysql)
        // rs.rowCount : insert, update, delete 의 데이터 개수 반환 (psql)

        result.data.article = rs.rows;
        result.success = true;

    } catch (e) {
        result.message = e.message;
    } finally {
        console.log("실행3")

        res.send(result);
    }
})
//게시글 자세히보기
router.get("/:articleidx", async (req, res) => {
    const articleidx = req.params.articleidx;
    const result = {
        "success": false,
        "message": "",
        "data": {
            "article": null
        }
    }

    try {
        pattern.nullCheck(articleidx)

        const sql = "SELECT a.idx, a.title, a.content, a.write_date, u.name FROM class.article a JOIN class.account u ON a.user_idx = u.idx WHERE a.idx = $1";
        const values = [articleidx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)
        result.data.article = rs.rows;
        result.success = true;

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//게시글 작성하기
router.post("/", async (req, res) => {
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

        await pool.query(sql, values)
        result.success = true;
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//게시글 수정하기
router.put("/:articleidx", async (req, res) => {
    const { title, content } = req.body;
    const useridx = req.session.idx
    const articleidx = req.params.articleidx;
    const result = {
        "success": false,
        "message": ""
    }
    try {
        pattern.nullCheck(useridx);
        pattern.nullCheck(title);
        pattern.nullCheck(content);
        pattern.nullCheck(articleidx);

        const sql = "UPDATE class.article SET title = $1, content = $2 WHERE idx = $3 AND user_idx = $4"; //db에서도 유저 idx검사
        const values = [title, content, articleidx, useridx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rowCount == 0) throw new Error("일치하는 게시글 없습니다") // 
        result.success = true;
        result.message = rs.rowCount + "개 수정"; // rs.affectedRows : insert, update, delete 의 데이터 개수 반환
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//게시글 삭제하기
router.delete("/:articleidx", async (req, res) => {
    const useridx = req.session.idx;
    const articleidx = req.params.articleidx;
    //idx 패스파라미터
    const result = {
        "success": false,
        "message": ""
    }
    try {

        pattern.nullCheck(useridx)
        pattern.nullCheck(articleidx)

        const sql = "DELETE FROM class.article WHERE idx = $1 AND user_idx = $2";
        const values = [articleidx, useridx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rowCount == 0) throw new Error("일치하는 게시글 없습니다") //굳이

        result.success = true;
        result.message = rs.rowCount + "개 삭제";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

module.exports = router;