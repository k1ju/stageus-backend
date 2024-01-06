const router = require("express").Router();
const { pool } = require('../config/db.js');
const middleware = require("../modules/validation.js");

//게시글 목록 불러오기route
router.get("/all", async (req, res, next) => {
    const result = {
        "data": {}
    }

    try {
        const sql = `SELECT a.idx, title, write_date, u.name
            FROM class.article a 
            JOIN class.account u ON a.user_idx = u.idx 
            ORDER BY a.idx`; //orderby는 idx로하기!

        const rs = await pool.query(sql)
        if (rs.rowCount == 0) throw new Error("게시글없음");
        // rs.rows : select 결과 반환
        // rs.affectedRows : insert, update, delete 의 데이터 개수 반환 (mysql)
        // rs.rowCount : insert, update, delete 의 데이터 개수 반환 (psql)

        result.data.article = rs.rows;

        res.status(200).send(result);

    } catch (e) {
        next(e);
    }
})
//게시글 자세히보기
router.get("/:articleidx",
    middleware.articleidxParamCheck,
    async (req, res, next) => {
        const articleidx = req.params.articleidx;
        const result = {
            "data": {}
        }

        try {
            const sql = "SELECT a.idx, a.title, a.content, a.write_date, u.name FROM class.article a JOIN class.account u ON a.user_idx = u.idx WHERE a.idx = $1";
            const values = [articleidx];

            const rs = await pool.query(sql, values)
            result.data.article = rs.rows;

            res.status(200).send(result);

        } catch (e) {
            next(e);
        }
    })

//게시글 작성하기
router.post("/",
    middleware.sessionCheck,
    middleware.titleCheck,
    middleware.contentCheck,
    async (req, res, next) => {

        const { title, content } = req.body;
        const useridx = req.session.userIdx;

        try {

            const sql = "INSERT INTO class.article(title,content,user_idx) VALUES ($1, $2, $3) ";
            const values = [title, content, useridx];

            await pool.query(sql, values)

            res.status(200).send();

        } catch (e) {
            next(e);
        }
    })

//게시글 수정하기
router.put("/:articleidx",
    middleware.sessionCheck,
    middleware.articleidxParamCheck,
    middleware.titleCheck,
    middleware.contentCheck,

    async (req, res, next) => {

        const { title, content } = req.body;
        const useridx = req.session.userIdx;
        const articleidx = req.params.articleidx;

        try {
            const sql = "UPDATE class.article SET title = $1, content = $2 WHERE idx = $3 AND user_idx = $4"; //db에서도 유저 idx검사
            const values = [title, content, articleidx, useridx];

            await pool.query(sql, values)

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    })

//게시글 삭제하기
router.delete("/:articleidx",
    middleware.sessionCheck,
    middleware.articleidxParamCheck,
    async (req, res, next) => {

        const useridx = req.session.userIdx;
        const articleidx = req.params.articleidx;

        try {
            const sql = "DELETE FROM class.article WHERE idx = $1 AND user_idx = $2";
            const values = [articleidx, useridx];

            const rs = await pool.query(sql, values)

            if (rs.rowCount == 0) throw new Error("일치하는 게시글 없습니다") //굳이

            res.status(200).send();

        } catch (e) {
            next(e);
        }
    })

module.exports = router;