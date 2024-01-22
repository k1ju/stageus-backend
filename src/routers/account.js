const router = require('express').Router();
const { pool } = require('../config/postgres.js'); // 풀 속성이 아닌 풀 객체를 받아오는 것이므로 {pool}이아닌 pool
const { validate } = require('../middlewares/validation.js');
const { visitorCount } = require('../modules/visitor.js');
const redisClient = require('../config/redis');

const { env } = require('../config/env.js');
const jwt = require('jsonwebtoken');
const loginCheck = require('../middlewares/loginCheck');
const { body, param, query, validationResult } = require('express-validator');
const loginUser = require('../modules/loginUser.js');

// 예외처리도 미들웨어처리
// 예외처리 fit하지않게 체이닝기법 .isnull.islengthCheck

//참고블로그: https://velog.io/@younoah/nodejs-express-validator

//api에서도 next이용
// 회원가입 api
router.post(
    '/',
    validate([
        body('userID').trim().notEmpty().isLength({ min: 1, max: 20 }),
        body('userPw').trim().notEmpty().isLength({ min: 1, max: 20 }),
        body('userPwCheck').custom((value, { req }) => {
            return value === req.body.userPw;
        }),
        body('userName').trim().notEmpty().isLength({ min: 1, max: 5 }),
        body('userPhonenumber')
            .trim()
            .customSanitizer((value) => value.replace(/[^0-9]/g, '')) //하이픈 제거
            .isLength({ min: 10, max: 12 }),
        body('userBirth').trim().notEmpty().isDate(),
    ]),
    async (req, res, next) => {
        const { userID, userPw, userName, userPhonenumber, userBirth } =
            req.body;

        try {
            const selectAccountSqlResult = await pool.query(
                `SELECT id, phonenumber FROM class.account WHERE id = $1 OR phonenumber = $2`,
                [userID, userPhonenumber]
            );

            const duplicatedAccount = selectAccountSqlResult.rows[0];

            if (duplicatedAccount) {
            }

            if (rs1.rows.length !== 0) throw new Error('id중복');
            if (rs2.rows.length !== 0) throw new Error('전화번호 중복');

            const sql3 = `INSERT INTO class.account(id, pw, name, phonenumber, birth) VALUES ($1, $2, $3, $4, $5)`;
            const values3 = [
                userID,
                userPw,
                userName,
                userPhonenumber,
                userBirth,
            ];
            await pool.query(sql3, values3);

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

// 로그인 api
router.get(
    '/login',
    validate([
        body('userID').trim().notEmpty().isLength({ min: 1, max: 20 }),
        body('userPw').trim().notEmpty().isLength({ min: 1, max: 20 }),
    ]),
    async (req, res, next) => {
        const { userID, userPw } = req.body;
        const result = {
            data: {},
        };

        try {
            const sql = 'SELECT * FROM class.account WHERE id = $1 AND pw = $2';
            const values = [userID, userPw];
            const rs = await pool.query(sql, values); // pool.query에는 내부적으로 커넥션을 acquire, release하는 작업이 포함되어있다.

            if (!rs.rows || rs.rows.length == 0)
                throw new Error('일치하는 회원정보없음');

            const user = rs.rows[0]; // rs.rows 는 배열로 반환

            const idx = user.idx;
            const isadmin = user.isadmin;

            const token = jwt.sign(
                {
                    idx: idx,
                    isadmin: isadmin,
                },
                process.env.secretCode,
                {
                    issuer: 'stageus',
                    expiresIn: '30m',
                }
            );

            result.data.token = token;
            res.locals.result = result.data;

            await visitorCount(userID);

            res.status(200).send(result);
        } catch (e) {
            next(e);
        }
    }
);

//id중복체크
router.get(
    '/idCheck',
    validate([body('userID').trim().notEmpty().isLength({ min: 1, max: 20 })]),
    async (req, res, next) => {
        const userID = req.body.userID;
        const result = {
            data: {},
        };

        try {
            const sql = `SELECT idx FROM class.account WHERE id = $1`;
            const values = [userID];
            const rs = await pool.query(sql, values);

            if (rs.rows.length != 0) throw new Error('id 중복');
            result.data.isDuplicated = false;
            res.locals.result = result.data;
        } catch (e) {
            next(e);
        }
    }
);
//id찾기
router.get(
    '/id',
    validate([
        body('userName').trim().isLength({ min: 1, max: 5 }),
        body('userPhonenumber')
            .trim()
            .customSanitizer((value) => value.replace(/[^0-9]/g, ''))
            .isLength({ min: 10, max: 12 }),
    ]),
    async (req, res, next) => {
        const { userName, userPhonenumber } = req.body;
        const result = {
            data: {},
        };

        try {
            const sql =
                'SELECT id FROM class.account WHERE name = $1 AND phonenumber = $2';
            const values = [userName, userPhonenumber];
            const selectQueryResult = await pool.query(sql, values);

            const foundAccount = selectQueryResult.rows[0];

            if (!foundAccount) throw new Error('일치하는 id없음');
            result.data.id = rs.rows[0].id.trim(); // id공백제거

            res.locals.result = result.data;
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//비밀번호찾기
router.get(
    '/pw',
    validate([
        body('userID').trim().isLength({ min: 1, max: 20 }),
        body('userName').trim().isLength({ min: 1, max: 5 }),
        body('userPhonenumber')
            .trim()
            .customSanitizer((value) => value.replace(/[^0-9]/g, ''))
            .isLength({ min: 10, max: 12 }),
    ]),
    async (req, res, next) => {
        const { userID, userName, userPhonenumber } = req.body;
        const result = {
            data: {},
        };

        try {
            const sql =
                'SELECT pw FROM class.account WHERE id = $1 AND name = $2 AND phonenumber = $3';
            const values = [userID, userName, userPhonenumber];

            const rs = await pool.query(sql, values);

            if (rs.rows.length == 0) throw new Error('일치하는 pw없음');

            res.locals.result = result.data;
            result.data.pw = rs.rows[0].pw.trim();
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//내정보보기
router.get('/info', loginCheck(), async (req, res, next) => {
    const idx = req.user.idx;
    const result = {
        data: {},
    };
    try {
        console.log('api실행');
        const sql = 'SELECT * FROM class.account WHERE idx = $1';
        const values = [idx];
        const rs = await pool.query(sql, values);

        if (rs.rows.length == 0) throw new Error('일치하는 회원정보없음');
        const user = rs.rows[0];

        result.data.idx = user.idx;
        result.data.name = user.name.trim(); //char타입에만 trim넣어줘야한다.
        result.data.phonenumber = user.phonenumber.trim();
        result.data.birth = user.birth;
        result.data.signupDate = user.signupDate;

        res.locals.result = result.data;
        console.log('res.locals: ', res.locals);
        console.log('res.locals.result: ', res.locals.result);

        if (user.profile == null) {
            result.data.profile = '내용없음';
        } else {
            result.data.profile = user.profile;
        }
        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

//정보수정
router.put(
    '/',
    loginCheck(),
    validate([
        body('userName').trim().isLength({ min: 1, max: 5 }),
        body('userPhonenumber')
            .trim()
            .customSanitizer((value) => value.replace(/[^0-9]/g, ''))
            .isLength({ min: 10, max: 12 }),
        body('userBirth').trim().isDate(),
    ]),
    async (req, res, next) => {
        const { userName, userPhonenumber, userBirth, profile } = req.body;
        const idx = req.user.idx;

        try {
            const sql =
                'SELECT phonenumber FROM class.account WHERE phonenumber = $1';
            const values = [userPhonenumber];
            const rs = await pool.query(sql, values);

            if (rs.rows.length != 0) throw new Error('연락처 중복');

            const sql2 =
                'UPDATE class.account SET name = $1, phonenumber = $2, birth = $3, profile = $4 WHERE idx = $5';
            const values2 = [
                userName,
                userPhonenumber,
                userBirth,
                profile,
                idx,
            ];

            await pool.query(sql2, values2);
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//회원탈퇴
router.delete('/', loginCheck(), async (req, res, next) => {
    const idx = req.user.idx;

    try {
        const sql = 'DELETE FROM class.account WHERE idx = $1';
        const values = [idx];

        await pool.query(sql, values);

        res.send();
    } catch (e) {
        next(e);
    }
});

router.get('/visitor', async (req, res, next) => {
    const result = {
        data: {},
    };

    try {
        const today = new Date().toISOString().substring(0, 10);

        let visitor = (await redisClient.sMembers(`visitor${today}`)) || 0;
        let visitorNumber = await redisClient.sCard(`visitor${today}`);

        result.data.visitor = visitor;
        result.data.visitorNumber = visitorNumber;

        res.status(200).send(result);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
