const router = require('express').Router();
const { pool } = require('../config/postgres.js');
const { validate } = require('../middlewares/validation.js');
const loginCheck = require('../middlewares/loginCheck.js');
const { body, param } = require('express-validator');
const recordSearchHistory = require('../modules/search.js');

//게시글 목록 불러오기route
router.get('/all', async (req, res, next) => {
    const result = {
        data: {},
    };

    try {
        const selectQueryResult = await pool.query(
            `SELECT a.idx, title, write_date, u.name
            FROM class.article a 
            JOIN class.account u ON a.user_idx = u.idx 
            ORDER BY a.idx`
        );
        const articleList = selectQueryResult.rows;

        result.data.article = articleList;

        res.locals.result = result.data;
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});
//게시글 자세히보기
router.get(
    '/:articleIdx',
    validate([param('articleIdx').trim().notEmpty()]),
    async (req, res, next) => {
        const articleIdx = req.params.articleIdx;
        const result = {
            data: {},
        };

        try {
            const articleQueryResult = await pool.query(
                `SELECT a.idx, a.title, a.content, a.write_date, u.name 
                FROM class.article a 
                JOIN class.account u 
                ON a.user_idx = u.idx 
                WHERE a.idx = $1`,
                [articleIdx]
            );

            const selectedArticle = articleQueryResult.rows;

            if (!selectedArticle) throw new Error('해당게시글 없음');

            result.data.article = selectedArticle;

            res.locals.result = result.data;
            res.status(200).send(result);
        } catch (e) {
            next(e);
        }
    }
);

//게시글 작성하기
router.post(
    '/',
    loginCheck(),
    validate([
        body('title').trim().notEmpty().withMessage('제목 널값'),
        body('content').trim().notEmpty().withMessage('내용 널값'),
    ]),
    async (req, res, next) => {
        const { title, content } = req.body;
        const user = req.user;

        try {
            await pool.query(
                `INSERT INTO class.article(title,content,user_idx) 
                VALUES ($1, $2, $3) , values)`,
                [title, content, user.idx]
            );

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//게시글 수정하기
router.put(
    '/:articleIdx',
    loginCheck,
    validate([
        param('articleIdx').trim().notEmpty(),
        body('title').trim().notEmpty(),
        body('content').trim().notEmpty(),
    ]),
    async (req, res, next) => {
        const { title, content } = req.body;
        const user = req.user;
        const articleIdx = req.params.articleIdx;
        // const articleIdx = Number(req.query['article-idx']);

        // GET /comment/all?idx=2
        // GET /article/3/comment/4/reply-comment/all

        try {
            await pool.query(
                `
                UPDATE 
                    class.article 
                SET 
                    title = $1, 
                    content = $2 
                WHERE 
                    idx = $3 
                AND 
                    user_idx = $4
                `,
                [title, content, articleIdx, useridx]
            );

            res.locals.result = result.data;
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//게시글 삭제하기
router.delete(
    '/:articleIdx',
    loginCheck,
    validate([param('articleIdx').trim().notEmpty()]),
    async (req, res, next) => {
        // const useridx = req.session.userIdx;
        const user = req.user;
        const articleIdx = req.params.articleIdx;

        try {
            const deleteQueryResult = await pool.query(
                `DELETE 
                FROM class.article 
                WHERE idx = $1 AND user_idx = $2
                `,
                [articleIdx, user.idx]
            );

            console.log('deleteQueryResult: ', deleteQueryResult);

            const deletedArticle = deleteQueryResult.rowCount;

            // if (!deletedArticle) throw new Error('일치하는 게시글 없음');

            res.locals.result = result.data;
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//게시글 검색하기
router.get('/', loginCheck(), async (req, res, next) => {
    const { title } = req.query;
    const result = {
        data: {},
    };
    const user = req.user;

    try {
        const selectArticleSqlResult = await pool.query(
            `SELECT a.idx, title, write_date, u.name
            FROM class.article a 
            JOIN class.account u ON a.user_idx = u.idx
            WHERE title LIKE '%' || $1 || '%' 
            ORDER BY a.idx`,
            [title]
        );

        const articleList = selectArticleSqlResult.rows

        if (!articleList) throw new Error('게시글없음');

        result.data.article = articleList

        res.locals.result = result.data.article;

        let searchHistory = await recordSearchHistory(user.idx, title);
        searchHistory = searchHistory.reverse();
        result.data.searchHistory = searchHistory;

        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
