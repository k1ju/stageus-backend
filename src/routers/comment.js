const router = require("express").Router();
const { pool } = require("../config/postgres");
const middleware = require("../modules/validation.js");
const loginCheck = require("../middlewares/loginCheck.js")


//댓글쓰기
router.post("/",
    loginCheck,
    // middleware.sessionCheck,
    middleware.articleidxBodyCheck,
    middleware.contentCheck,
    async (req, res, next) => {

        const { articleidx, content } = req.body;
        // const idx = req.session.userIdx;
        const idx =  req.user.idx;
        console.log(idx)

        try {
            const sql = "INSERT INTO class.comment(content, user_idx, article_idx) VALUES ($1, $2, $3) ";
            const values = [content, idx, articleidx];

            await pool.query(sql, values)

            res.status(200).send();
        } catch (e) {
            next(e);
        } 
})
//댓글 불러오기
router.get("/",
    middleware.articleidxBodyCheck,

    async (req, res, next) => {

        const articleidx = req.body.articleidx;
        const result = {
            "data": {}
        };

        try {
            //백틱으로 한번에 보기
            const sql = ` 
                SELECT c.idx, content, write_date, name 
                FROM class.comment c 
                JOIN class.account u ON c.user_idx = u.idx 
                WHERE article_idx = $1 
                ORDER BY c.idx `;
            const values = [articleidx];

            const rs = await pool.query(sql, values)
            
            if(rs.rowCount == 0) throw new Error("작성된 댓글없음")
            result.data.comment = rs.rows;

            res.status(200).send(result);
        } catch (e) {
            next(e);
        } 
})
//댓글수정하기
router.put("/:commentidx",
    loginCheck,
    // middleware.sessionCheck,
    middleware.contentCheck,
    middleware.commentidxParamCheck,
    async (req, res, next) => {

        const commentidx = req.params.commentidx;
        const idx =  req.user.idx;
        // const idx = req.session.userIdx;
        const { content } = req.body;

        try {
            const sql = "UPDATE class.comment SET content = $1 WHERE idx = $2 AND user_idx = $3 ";
            const values = [content, commentidx, idx];

            await pool.query(sql, values)

            res.status(200).send();
        } catch (e) {
            next(e);
        } 
})
//댓글삭제하기
router.delete("/:commentidx",
    loginCheck,
    // middleware.sessionCheck,
    middleware.commentidxParamCheck,
    async (req, res, next) => {

        const commentidx = req.params.commentidx;
        const idx =  req.user.idx;
        // const idx = req.session.userIdx;

        try {
            const sql = "DELETE FROM class.comment WHERE idx = $1 AND user_idx = $2 ";
            const values = [commentidx, idx];

            await pool.query(sql, values)

            res.status(200).send();
        } catch (e) {
            next(e);
        } 
})

module.exports = router;




