const router = require('express').Router();
const { pool } = require('../config/postgres.js'); // 풀 속성이 아닌 풀 객체를 받아오는 것이므로 {pool}이아닌 pool
const { validate } = require('../middlewares/validation.js');
const redisClient = require('../config/redis');

const { env } = require('../config/env.js');
const jwt = require('jsonwebtoken');
const loginCheck = require('../middlewares/loginCheck');
const { body } = require('express-validator');
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

            if (duplicatedAccount) throw new Error('id 혹은 전화번호 중복');

            await pool.query(
                `INSERT INTO class.account(id, pw, name, phonenumber, birth) 
                VALUES ($1, $2, $3, $4, $5)`,
                [userID, userPw, userName, userPhonenumber, userBirth]
            );

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
            const selectAccountSqlResult = await pool.query(
                // pool.query에는 내부적으로 커넥션을 acquire, release하는 작업이 포함되어있다.
                `SELECT idx, isadmin FROM class.account WHERE id = $1 AND pw = $2`,
                [userID, userPw]
            );

            const selectedAccount = selectAccountSqlResult.rows[0];

            if (!selectedAccount) throw new Error('일치하는 회원정보없음');

            const token = jwt.sign(
                {
                    idx: selectedAccount.idx,
                    isadmin: selectedAccount.isadmin,
                },
                process.env.secretCode,
                {
                    issuer: 'stageus',
                    expiresIn: '30m',
                }
            );


            result.data.token = token;
            res.locals.result = result.data;

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
            const selectAccountSqlResult = await pool.query(
                `SELECT idx FROM class.account WHERE id = $1`,
                [userID]
            );

            const duplicatedAccount = selectAccountSqlResult.rows[0];

            if (duplicatedAccount) throw new Error('id 중복');

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
            .customSanitizer((value) => value.replace(/[^0-9]/g, '')) // 하이픈 제거
            .isLength({ min: 10, max: 12 }),
    ]),
    async (req, res, next) => {
        const { userName, userPhonenumber } = req.body;
        const result = {
            data: {},
        };

        try {
            const selectQueryResult = await pool.query(
                'SELECT id FROM class.account WHERE name = $1 AND phonenumber = $2',
                [userName, userPhonenumber]
            );

            const foundAccount = selectQueryResult.rows[0];

            if (!foundAccount) throw new Error('일치하는 id없음');
            result.data.id = foundAccount.id.trim(); // id공백제거

            res.locals.result = result.data;
            res.status(200).send(result);
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
            .customSanitizer((value) => value.replace(/[^0-9]/g, '')) //하이픈제거
            .isLength({ min: 10, max: 12 }),
    ]),
    async (req, res, next) => {
        const { userID, userName, userPhonenumber } = req.body;
        const result = {
            data: {},
        };

        try {
            const selectAccountSqlResult = await pool.query(
                'SELECT pw FROM class.account WHERE id = $1 AND name = $2 AND phonenumber = $3',
                [userID, userName, userPhonenumber]
            );

            const foundAccount = selectAccountSqlResult.rows[0];

            if (!foundAccount) throw new Error('일치하는 pw없음');

            result.data.pw = foundAccount.pw.trim();

            res.locals.result = result.data;

            res.status(200).send(result);
        } catch (e) {
            next(e);
        }
    }
);

//내정보보기
router.get('/info', loginCheck(), async (req, res, next) => {
    const user = req.user;

    const result = {
        data: {},
    };
    try {
        const selectAccountSqlResult = await pool.query(
            `SELECT * FROM class.account WHERE idx = $1`,
            [user.idx]
        );

        const foundAccount = selectAccountSqlResult.rows[0];

        if (!foundAccount) throw new Error('일치하는 회원정보없음');

        result.data.idx = foundAccount.idx;
        result.data.name = foundAccount.name.trim(); //char타입에만 trim넣어줘야한다.
        result.data.phonenumber = foundAccount.phonenumber.trim();
        result.data.birth = foundAccount.birth;
        result.data.signupDate = foundAccount.signupDate;

        res.locals.result = result.data;

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
            .customSanitizer((value) => value.replace(/[^0-9]/g, '')) // 하이픈 제거
            .isLength({ min: 10, max: 12 }),
        body('userBirth').trim().isDate(),
    ]),
    async (req, res, next) => {
        const { userName, userPhonenumber, userBirth, profile } = req.body;
        const user = req.user;

        try {
            const selectPhonenumberSqlResult = await pool.query(
                'SELECT phonenumber FROM class.account WHERE phonenumber = $1',
                [userPhonenumber]
            );
            console.log('selectPhonenumberSqlResult: ', selectPhonenumberSqlResult);

            const duplicatedPhonenumber = selectPhonenumberSqlResult.rows[0];
            if (duplicatedPhonenumber) throw new Error('연락처 중복');

            await pool.query(
                'UPDATE class.account SET name = $1, phonenumber = $2, birth = $3, profile = $4 WHERE idx = $5',
                [userName, userPhonenumber, userBirth, profile, user.idx]
            );

            res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

//회원탈퇴
router.delete('/', loginCheck(), async (req, res, next) => {
    const user = req.user;

    try {
        await pool.query(
            'DELETE FROM class.account WHERE idx = $1', 
            [user.idx]
        );

        res.status(200).send();
    } catch (e) {
        next(e);
    }
});

//방문자 조회
router.get('/visitor', async (req, res, next) => {
    const { year, month, day } = req.body;
    const result = {
        data: {},
    };

    try {

        const visitorNumberSqlResult = await pool.query(`
                    SELECT count(*)
                    FROM class.visitor
                    WHERE EXTRACT ( YEAR FROM visit_date ) = $1 
                    AND   EXTRACT ( MONTH FROM visit_date ) = $2  
                    AND   EXTRACT ( DAY FROM visit_date ) = $3
                    `, [year, month, day] 
        );

        const visitorNumber = visitorNumberSqlResult.rows[0].count;

        result.data.visitorNumber = visitorNumber;
        
        res.status(200).send(result);
    
    } catch (e) {
        next(e);
    }
});

module.exports = router;
