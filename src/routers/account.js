
const router = require("express").Router();
const { pool } = require("../config/postgres.js"); // 풀 속성이 아닌 풀 객체를 받아오는 것이므로 {pool}이아닌 pool
const middleware = require("../modules/validation.js");
const jwt = require("jsonwebtoken")
const loginCheck = require("../middlewares/loginCheck")


// 예외처리도 미들웨어처리
// 예외처리 fit하지않게 체이닝기법 .isnull.islengthCheck

//참고블로그: https://velog.io/@younoah/nodejs-express-validator

//api에서도 next이용
// 회원가입 api
router.post('/',
    [middleware.userIDCheck,
    middleware.userPwCheck,
    middleware.userPwCheckCheck,
    middleware.userNameCheck,
    middleware.userPhonenumberCheck,
    middleware.userBirthCheck],
    async (req, res, next) => {
        const { userID, userPw, userName, userPhonenumber, userBirth } = req.body;

        try {
            const sql1 = `SELECT * FROM class.account WHERE id = $1`;
            const sql2 = `SELECT * FROM class.account WHERE phonenumber = $1`;
            const values1 = [userID];
            const values2 = [userPhonenumber];

            const [rs1, rs2] = await Promise.all([
                pool.query(sql1, values1),
                pool.query(sql2, values2)
            ])

            // const rs1 = await pool.query(sql1, values1); // 51ms 41 44
            // const rs2 = await pool.query(sql2, values2);

            if (rs1.rows.length != 0) throw new Error("id중복");
            if (rs2.rows.length != 0) throw new Error("전화번호 중복");

            const sql3 = `INSERT INTO class.account(id, pw, name, phonenumber, birth) VALUES ($1, $2, $3, $4, $5)`;
            const values3 = [userID, userPw, userName, userPhonenumber, userBirth];
            await pool.query(sql3, values3);

            res.status(200).send();

        } catch (e) {
            next(e);
        }
    })


// 로그인 api
router.get("/login",
    middleware.userIDCheck,
    middleware.userPwCheck,
    async (req, res, next) => {
        const { userID, userPw } = req.body;
        const result = {
            "data": {}
        }

        try {
            const sql = "SELECT * FROM class.account WHERE id = $1 AND pw = $2";
            const values = [userID, userPw];

            const rs = await pool.query(sql, values) // pool.query에는 내부적으로 커넥션을 acquire, release하는 작업이 포함되어있다.

            if (!rs.rows || rs.rows.length == 0) throw new Error("일치하는 회원정보없음");

            const user = rs.rows[0]
            const idx = user.idx
            console.log("rs의 idx:",idx)

            // 토큰생성, 페이로드에는 바뀌지않는값 PK
            const token = jwt.sign({
                "idx": idx
            }, process.env.secretCode, {
                "issuer": "stageus",
                "expiresIn": "30m"
            })

            result.data.token = token;

            // const user = rs.rows[0]; // rs.rows 는 배열로 반환
            // req.session.userIdx = user.idx; // 숫자형에 trim하면 에러
            // req.session.userID = user.id.trim(); // char에만 trim해주기
            // req.session.userName = user.name.trim();
            // req.session.userPhonenumber = user.phonenumber.trim();
            // req.session.userBirth = user.birth;

            res.status(200).send(result);

        } catch (e) {
            next(e);
        }
    })

//로그아웃
router.delete("/logout",
    middleware.sessionCheck,
    (req, res, next) => {

        try {
            req.session.destroy();
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    })

//id중복체크
router.get("/idCheck",
    middleware.userIDCheck,
    async (req, res, next) => {

        const userID = req.body.userID;
        const result = {
            "data": {}
        };

        try {
            const sql = `SELECT idx FROM class.account WHERE id = $1`;
            const values = [userID];

            const rs = await pool.query(sql, values);

            if (rs.rows.length != 0) throw new Error("id 중복");
            result.data.isDuplicated = false;

        } catch (e) {
            next(e);
        }
    })
//id찾기
router.get("/id",
    middleware.userNameCheck,
    middleware.userPhonenumberCheck,
    async (req, res, next) => {

        const { userName, userPhonenumber } = req.body;
        const result = {
            "data": {}
        }

        try {
            const sql = "SELECT id FROM class.account WHERE name = $1 AND phonenumber = $2";
            const values = [userName, userPhonenumber];

            const rs = await pool.query(sql, values)

            if (rs.rows.length == 0) throw new Error("일치하는 id없음")
            result.data.id = rs.rows[0].id.trim(); // id공백제거 
            res.status(200).send();

        } catch (e) {
            next(e)
        }
    })

//비밀번호찾기
router.get("/pw",
    middleware.userIDCheck,
    middleware.userNameCheck,
    middleware.userPhonenumberCheck,
    async (req, res, next) => {

        const { userID, userName, userPhonenumber } = req.body;
        const result = {
            "data": {}
        }

        try {
            const sql = "SELECT pw FROM class.account WHERE id = $1 AND name = $2 AND phonenumber = $3";
            const values = [userID, userName, userPhonenumber];

            const rs = await pool.query(sql, values)

            if (rs.rows.length == 0) throw new Error("일치하는 pw없음")
            result.data.pw = rs.rows[0].pw.trim();
            res.status(200).send();

        } catch (e) {
            next(e);
        }
    })


//내정보보기
router.get("/info",
    loginCheck,
    // middleware.sessionCheck,
    async (req, res, next) => {
        console.log("api실행");

        // const idx = req.session.userIdx;
        const idx = req.user.idx;
        const result = {
            "data": {}
        };
        try {
            const sql = "SELECT * FROM class.account WHERE idx = $1";
            const values = [idx];

            const rs = await pool.query(sql, values)

            if (rs.rows.length == 0) throw new Error("일치하는 회원정보없음")
            const user = rs.rows[0]

            result.data.idx = user.idx
            result.data.name = user.name.trim();  //char타입에만 trim넣어줘야한다.
            result.data.phonenumber = user.phonenumber.trim();
            result.data.birth = user.birth;
            result.data.signupDate = user.signupDate;
            console.log(result);

            if (user.profile == null) {
                result.data.profile = "내용없음";
            } else {
                result.data.profile = user.profile;
            }
            res.status(200).send(result);

        } catch (e) {
            next(e);
        }
    })

//정보수정
router.put("/",
    loginCheck,
    // middleware.sessionCheck,
    middleware.userNameCheck,
    middleware.userPhonenumberCheck,
    middleware.userBirthCheck,
    async (req, res, next) => {
        const { userName, userPhonenumber, birth, profile } = req.body;
        // const idx = req.session.userIdx;
        const idx = req.user.idx;

        try {
            const sql = "SELECT phonenumber FROM class.account WHERE phonenumber = $1";
            const values = [userPhonenumber]
            const rs = await pool.query(sql, values)

            if (rs.rows.length != 0) throw new Error("연락처 중복")

            const sql2 = "UPDATE class.account SET name = $1, phonenumber = $2, birth = $3, profile = $4 WHERE idx = $5";
            const values2 = [userName, userPhonenumber, birth, profile, idx];

            await pool.query(sql2, values2)
            res.status(200).send();

        } catch (e) {
            next(e);
        }
    })

//회원탈퇴
router.delete("/",
    loginCheck,
    // middleware.sessionCheck,
    async (req, res, next) => {
        // const idx = req.session.userIdx;
        const idx = req.user.idx;

        try {
            const sql = "DELETE FROM class.account WHERE idx = $1";
            const values = [idx];

            await pool.query(sql, values)

            req.session.destroy();
            res.send();

        } catch (e) {
            next(e);
        }
    })

module.exports = router;



