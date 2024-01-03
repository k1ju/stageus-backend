const router = require("express").Router();
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');
const pattern = require("../modules/pattern.js");


//댓글쓰기
router.post("/", async (req, res) => {
    const { articleidx, content } = req.body;
    const idx = req.session.idx;
    const result = {
        "success": false,
        "message": ""
    }
    try {
        pattern.nullCheck(articleidx);
        pattern.nullCheck(content);
        pattern.nullCheck(idx);

        const sql = "INSERT INTO class.comment(content, user_idx, article_idx) VALUES ($1, $2, $3) ";
        const values = [content, idx, articleidx];
        const pool = new Pool(dbconfig);

        await pool.query(sql, values)
        result.success = true;
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//댓글 불러오기
router.get("/", async (req, res) => {
    const articleidx = req.query.articleidx;
    const result = {
        "success": false,
        "message": "",
        "data": {
            "comment": null
        }
    };
    try {
        pattern.nullCheck(articleidx);
        //백틱으로 한번에 보기
        const sql = ` 
            SELECT c.idx, content, write_date, name 
            FROM class.comment c 
            JOIN class.account u ON c.user_idx = u.idx 
            WHERE article_idx = $1 
            ORDER BY c.idx `;
        const values = [articleidx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)
        if(rs.rowCount == 0) throw new Error("작성된 댓글없음")
        result.data.comment = rs.rows;
        result.success = true;
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//댓글수정하기
router.put("/:commentidx", async (req, res) => {
    const commentidx = req.params.commentidx;
    const idx = req.session.idx
    const { content } = req.body;
    const result = {
        "success": false,
        "message": ""
    };

    try {
        pattern.nullCheck(commentidx);
        pattern.nullCheck(content);
        pattern.nullCheck(idx);

        const sql = "UPDATE class.comment SET content = $1 WHERE idx = $2 AND user_idx = $3 ";
        const values = [content, commentidx, idx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)
        result.success = true
        result.message = rs.rowCount + "개 수정";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//댓글삭제하기
router.delete("/:commentidx", async (req, res) => {

    const commentidx = req.params.commentidx;
    const idx = req.session.idx;
    const result = {
        "success": false,
        "message": ""
    }

    try {
        pattern.nullCheck(commentidx);
        pattern.nullCheck(idx);

        const sql = "DELETE FROM class.comment WHERE idx = $1 AND user_idx = $2 ";
        const values = [commentidx, idx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)
        result.success = true
        result.message = rs.rowCount + "개 삭제";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

module.exports = router;




