
const router = require("express").Router();
const pattern = require("../modules/pattern.js");
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');

// 회원가입 api
router.post('/', async (req, res, next) => {
    const { userID, userPw, userPwCheck, userName, userPhonenumber, userBirth } = req.body;

    try {
        //모듈 함수
        pattern.nullCheck(userID)
        if (userPw != userPwCheck) throw new Error("비밀번호확인 불일치");

        //문제: 예외처리가 isnull, islength 와 같이 되어야함. fit하지않게*, 체이닝기법이용 .isnull.islengthCheck....
        pattern.userIDCheck(userID);
        pattern.userPwCheck(userPw);
        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);
        pattern.userBirthCheck(userBirth);

        const pool = new Pool(dbconfig); // 풀생성을 db.js에서 해주기

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
router.get("/login", async (req, res, next) => {
    const { userID, userPw } = req.body;

    try {
        pattern.userIDCheck(userID);
        pattern.userPwCheck(userPw);

        const sql = "SELECT * FROM class.account WHERE id = $1 AND pw = $2";
        const values = [userID, userPw];
        //query메소드의 3번째인자의 함수는 콜백함수로, 비동기적으로 동작하는 함수이다
        //그래서 query문의 뒷부분까지 미리 실행되고나서, 콜백함수 실행된다.
        //함수구조를 바꾸어 동기적으로 작동하게끔 만들어준다.
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)
        // pool.query에는 내부적으로 커넥션을 acquire, release하는 작업이 포함되어있다.

        if (!rs.rows || rs.rows.length == 0) throw new Error("일치하는 회원정보없음");

        const user = rs.rows[0];

        req.session.idx = user.idx; // 숫자형에 trim하면 에러
        req.session.id = user.id.trim(); // char에만 trim해주기
        req.session.name = user.name.trim();
        req.session.phonenumber = user.phonenumber.trim();
        req.session.birth = user.birth;

        res.status(200).send();

    } catch (e) {
        next(e);
    }
})

//로그아웃
router.delete("/logout", (req, res, next) => {

    try {
        req.session.destroy();
        res.status(200).send();
    } catch (e) {
        next(e);
    }
})

//id중복체크
router.get("/idCheck", async (req, res, next) => {
    const userID = req.body.userID;
    const result = {
        "data": null
    }

    try {
        pattern.userIDCheck(userID);

        const sql = `SELECT idx FROM class.account WHERE id = $1`;
        const values = [userID];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rows.length != 0) throw new Error("id 중복")
        result.data.isDuplicated = false

    } catch (e) {
        next(e)
    }
})
//id찾기
router.get("/id", async (req, res, next) => {
    const { userName, userPhonenumber } = req.body;
    const result = {
        "data": null
    }
    try {
        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);

        const sql = "SELECT id FROM class.account WHERE name = $1 AND phonenumber = $2";
        const values = [userName, userPhonenumber];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rows.length == 0) throw new Error("일치하는 id없음")
        result.data.id = rs.rows[0].id.trim(); // id공백제거 
        res.status(200).send();

    } catch (e) {
        next(e)
    }
})
//비밀번호찾기
router.get("/pw", async (req, res, next) => {
    //예외처리
    const { userID, userName, userPhonenumber } = req.body;
    const result = {
        "data": null
    }
    try {
        pattern.userIDCheck(userID);
        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);

        const sql = "SELECT pw FROM class.account WHERE id = $1 AND name = $2 AND phonenumber = $3";
        const values = [userID, userName, userPhonenumber];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rows.length == 0) throw new Error("일치하는 pw없음")
        result.data.pw = rs.rows[0].pw.trim();
        res.status(200).send();

    } catch (e) {
        next(e);
    }
})
//내정보보기
router.get("/info", async (req, res, next) => {
    const idx = req.session.idx;
    const result = {
        "data": null
    };
    try {
        pattern.nullCheck(idx)
        console.log(idx, idx, idx)

        const sql = "SELECT * FROM class.account WHERE idx = $1";
        const values = [idx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rows.length == 0) throw new Error("일치하는 회원정보없음")
        const user = rs.rows[0]

        result.data.name = user.name.trim();  //char타입에만 trim넣어줘야한다.
        result.data.phonenumber = user.phonenumber.trim();
        result.data.birth = user.birth;
        result.data.signupDate = user.signupDate;

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
router.put("/", async (req, res, next) => {
    const { userName, userPhonenumber, birth, profile } = req.body;
    const idx = req.session.idx

    try {
        pattern.nullCheck(idx)

        const pool = new Pool(dbconfig);

        const sql = "SELECT phonenumber FROM class.account WHERE phonenumber = $1";
        const values = [userPhonenumber]
        const rs = await pool.query(sql, values)

        if (rs.rows.length != 0) throw new Error("연락처 중복")

        const sql2 = "UPDATE class.account SET name = $1, phonenumber = $2, birth = $3, profile = $4 WHERE idx = $5";
        const values2 = [userName, userPhonenumber, birth, profile, idx];

        await pool.query(sql2, values2)
        res.status(200).send();

    } catch (e) {
        console.log(e.status)
        next(e);
    }
})

//회원탈퇴
router.delete("/", async (req, res, next) => {
    const idx = req.session.idx;
    const result = {
        "success": false,
        "message": "",
    };
    try {
        pattern.nullCheck(idx);

        const sql = "DELETE FROM class.account WHERE idx = $1";
        const values = [idx];
        const pool = new Pool(dbconfig);

        await pool.query(sql, values)

        req.session.destroy();
        res.send(result);

    } catch (e) {
        next(e);
    }
})

module.exports = router;



