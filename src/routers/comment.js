const commentRouter = require('express').Router();
const { pool } = require('../config/postgres');
const {validate} = require('../middlewares/validation.js');
const loginCheck = require('../middlewares/loginCheck.js');
const { body, param } = require('express-validator');

//댓글쓰기
commentRouter.post(
    '/',
    loginCheck(),
    validate([
        body('articleIdx').trim().notEmpty(),
        body('content').trim().notEmpty(),
    ]),

    async (req, res, next) => {
        const { articleIdx, content } = req.body;
        const user = req.user;

        try {
            await pool.query(
                'INSERT INTO class.comment(content, user_idx, article_idx) VALUES ($1, $2, $3)',
                [content, user.idx, articleIdx]
            )

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);
//댓글 불러오기
commentRouter.get(
    '/',
    validate([
        body('articleIdx').trim().notEmpty()
    ]),

    async (req, res, next) => {
        const articleIdx = req.body.articleIdx;
        const result = {
            data: {},
        };

        try {
            const selectCommentSqlResult = await pool.query(` 
            SELECT c.idx, content, write_date, name 
            FROM class.comment c 
            JOIN class.account u ON c.user_idx = u.idx 
            WHERE article_idx = $1 
            ORDER BY c.idx `, 
            [articleIdx]);

            const commentList = selectCommentSqlResult.rows

            result.data.comment = commentList;

            res.locals.result = result.data;
            res.status(200).send(result);
        } catch (e) {
            next(e);
        }
    }
);
//댓글수정하기
commentRouter.put(
    '/:commentIdx',
    loginCheck(),
    validate([
        body('content').trim().notEmpty(),
        param('commentIdx').trim().notEmpty(),
    ]),
    async (req, res, next) => {
        const commentIdx = req.params.commentIdx;
        const user = req.user;
        const { content } = req.body;

        try {
            await pool.query(
                'UPDATE class.comment SET content = $1 WHERE idx = $2 AND user_idx = $3 ', 
                [content, commentIdx, user.idx]
            );

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);
//댓글삭제하기
commentRouter.delete(
    '/:commentIdx',
    loginCheck(),
    validate([
        param('commentIdx').trim().notEmpty()
    ]),
    async (req, res, next) => {
        const commentIdx = req.params.commentIdx;
        const user = req.user;

        try {
            await pool.query(
                'DELETE FROM class.comment WHERE idx = $1 AND user_idx = $2 ', 
                [commentIdx, user.idx]
            );

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

module.exports = commentRouter;
