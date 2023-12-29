
const router = require("express").Router();
const pattern = require("../modules/pattern.js");
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');

// 회원가입 api
//여기서도 아이디중복체크, 전화번호 중복체크 해야함.
// 비동기함수처리하기
router.post('/', async (req, res) => {
    const { userID, userPw, userPwCheck, userName, userPhonenumber, userBirth } = req.body;
    const result = {
        "success": false,
        "message": ""
    };

    try {
        //모듈 함수
        if (!userID?.trim() || !userPw?.trim() || !userPwCheck?.trim() || !userName?.trim() || !userPhonenumber?.trim() || !userBirth?.trim()) throw new Error("빈값이 존재해요");
        if (userPw != userPwCheck) throw new Error("비밀번호확인 불일치");

        pattern.userIDCheck(userID);
        pattern.userPwCheck(userPw);
        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);
        pattern.userBirthCheck(userBirth);

        const pool = new Pool(dbconfig);

        const sql1 = `SELECT * FROM class.account WHERE id = $1`;
        const sql2 = `SELECT * FROM class.account WHERE phonenumber = $1`;
        const values1 = [userID];
        const values2 = [userPhonenumber];

        const [rs1, rs2] = await Promise.all([
            pool.query(sql1, values1),  // 1초소요
            pool.query(sql2, values2)
        ])

        if(rs1.rows.length != 0) throw new Error("id중복"); 
        if(rs2.rows.length != 0) throw new Error("전화번호 중복");

        const sql3 = `INSERT INTO class.account(id, pw, name, phonenumber, birth) VALUES ($1, $2, $3, $4, $5)`;
        const values3 = [userID, userPw, userName, userPhonenumber, userBirth];
        await pool.query(sql3, values3);

        result.success = true;

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

// 로그인 api
router.get("/login", async (req, res) => {
    const { userID, userPw } = req.body;
    const result = {
        "success": false,
        "message": ""
    };

    try {
        //if문 한줄로 줄이기
        if (!userID?.trim() || !userPw?.trim()) throw new Error("빈값이 존재해요");

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

        result.success = true;
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

//로그아웃
router.delete("/logout", (req, res) => {
    const result = {
        "success": false,
        "message": ""
    }
    try {
        req.session.destroy();
        result.success = true;
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

//id중복체크
router.get("/idCheck", async (req, res) => {
    const userID = req.body.userID;
    const result = {
        "success": false,
        "message": "",
        "data":
            { "isDuplicated": true } // ""붙이나 안붙이나 상관없지만 붙이자
    }

    try {
        if (!userID?.trim()) throw new Error("빈값이 존재해요");
        pattern.userIDCheck(userID);

        const sql = `SELECT idx FROM class.account WHERE id = $1`;
        const values = [userID];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rows.length != 0) throw new Error("id 중복")
        result.success = true;
        result.data.isDuplicated = false

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//id찾기
router.get("/id", async(req, res) => {
    const { userName, userPhonenumber } = req.body;
    const result = {
        "success": false,
        "message": "",
        "data":
            { "id": "" }
    }
    try {
        if (!userName?.trim() || !userPhonenumber?.trim()) throw new Error("빈값이 존재해요");

        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);

        const sql = "SELECT id FROM class.account WHERE name = $1 AND phonenumber = $2";
        const values = [userName, userPhonenumber];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rows.length == 0) throw new Error("일치하는 id없음")
        result.success = true;
        result.data.id = rs.rows[0].id.trim(); // id공백제거 

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result)
    }
})
//비밀번호찾기
router.get("/pw", async(req, res) => {
    //예외처리
    const { userID, userName, userPhonenumber } = req.body;
    const result = {
        "success": false,
        "message": "",
        "data":
            { "pw": "" }
    }
    try {
        if (!userID?.trim() || !userName?.trim() || !userPhonenumber?.trim()) throw new Error("빈값이 존재해요")

        pattern.userIDCheck(userID);
        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);

        const sql = "SELECT pw FROM class.account WHERE id = $1 AND name = $2 AND phonenumber = $3";
        const values = [userID, userName, userPhonenumber];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values)

        if (rs.rows.length == 0) throw new Error("일치하는 pw없음")
        result.success = true;
        result.data.pw = rs.rows[0].pw.trim();

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//내정보보기
router.get("/info", async(req, res) => {
    const idx = req.session.idx;
    const result = {
        "success": false,
        "message": "",
        "data": {
            "name": "",
            "phonenumber": "",
            "birth": "",
            "signupDate": "",
            "profile": ""
        }
    };
    try {
        pattern.nullCheck(idx)
        console.log(idx)

        const sql = "SELECT * FROM class.account WHERE idx = $1";
        const values = [idx];
        const pool = new Pool(dbconfig);

        const rs = await pool.query(sql, values) 

        if (rs.rows.length == 0) throw new Error("일치하는 회원정보없음")
        result.success = true;
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

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

//정보수정
router.put("/", async (req, res) => {
    const { userName, userPhonenumber, birth, profile } = req.body;
    const idx = req.session.idx
    const result = {
        "success": false,
        "message": ""
    }
    try {
        pattern.nullCheck(idx)

        const pool = new Pool(dbconfig);

        const sql = "SELECT phonenumber FROM class.account WHERE phonenumber = $1";
        const values = [userPhonenumber]
        const rs = await pool.query(sql, values)

        if(rs.rows.length != 0) throw new Error("연락처 중복")

        const sql2 = "UPDATE class.account SET name = $1, phonenumber = $2, birth = $3, profile = $4 WHERE idx = $5";
        const values2 = [userName, userPhonenumber, birth, profile, idx];

        await pool.query(sql2, values2)
        result.success = true;

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

//회원탈퇴
router.delete("/", async (req, res) => {
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
        result.success = true;

    } catch (e) {
        result.message = e.message;
    } finally {
        req.session.destroy();
        res.send(result);

    }
})

module.exports = router;



