const router = require('express').Router();
const { pool } = require('../config/postgres.js');
const { validate } = require('../middlewares/validation.js');
const loginCheck = require('../middlewares/loginCheck.js');
const { body, param } = require('express-validator');
const { recordSearchHistory, getSearchHistory } = require('../modules/search.js');
const multer = require('multer');
const path = require('path');

// const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
// router.post('/', upload.single('photos'), (req, res) => {
//   console.log(req.file); 
// });

const upload = multer({
    storage : multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'files/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
})


//게시글 검색route
router.get('/search/all', loginCheck(), async (req, res, next) => {
    const result = {
        data: {},
    };
    const { title } = req.query;
    const user = req.user;

    try {
        const selectQueryResult = await pool.query(
            `SELECT a.idx, title, write_date, u.name
            FROM class.article a 
            JOIN class.account u ON a.user_idx = u.idx
            WHERE title LIKE '%' || $1 || '%' 
            ORDER BY a.idx`,
            [title]
        );
        const articleList = selectQueryResult.rows;

        result.data.article = articleList;

        res.locals.result = result.data;

        recordSearchHistory(user.idx, title);

        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});
// 검색기록 불러오기 api
router.get('/search/history', loginCheck(), async (req, res, next) => {
    console.log('api실행');

    const result = {
        data: {},
    };
    const user = req.user;

    try {
        const searchHistoryList = await getSearchHistory(user.idx);
        console.log('searchHistoryList: ', searchHistoryList);

        result.data.searchHistory = searchHistoryList;

        res.locals.result = searchHistoryList;

        // searchHistory = searchHistory.reverse();

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
    // validate([
    //     body('title').trim().notEmpty().withMessage('제목 널값'),
    //     body('content').trim().notEmpty().withMessage('내용 널값'),
    // ]),
    upload.array('photos', 3),
    async (req, res, next) => {

        const { title, content } = JSON.parse(req.body.data);
        console.log('content: ', content);
        console.log('title: ', title);
        const user = req.user;



        try {
            await pool.query(
                `INSERT INTO class.article(title,content,user_idx) 
                VALUES ($1, $2, $3)`,
                [title, content, user.idx]
            );

            console.log('req.files: ', req.files);

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//게시글 수정하기
router.put(
    '/:articleIdx',
    loginCheck(),
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
                [title, content, articleIdx, user.idx]
            );

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//게시글 삭제하기
router.delete(
    '/:articleIdx',
    loginCheck(),
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

            if (!deletedArticle) throw new Error('일치하는 게시글 없음');

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

module.exports = router;
