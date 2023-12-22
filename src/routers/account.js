
const router = require("express").Router();
const regexPattern = require("../modules/regexPattern.js");
const session = require("express-session");
const mysql = require('mysql');
const dbconfig = require('../../config/db.js');

require('dotenv').config();
const secretCode = process.env.secretCode; // .env로부터 환경변수 불러오기

//세션 환경변수로 만들기
router.use(session({
    resave: false,
    saveUninitialized: false,
    secret: secretCode  //secretCode보안
}));

// 회원가입 api
router.post('/', (req, res) => {
    const { userID, userPw, userPwCheck, userName, userPhonenumber, userBirth } = req.body;
    const result = {
        "success": false,
        "message": ""
    };

    try {
        if (!userID?.trim() || !userPw?.trim() || !userPwCheck?.trim() || !userName?.trim() || !userPhonenumber?.trim() || !userBirth?.trim()) throw new Error("빈값이 존재해요");
        if (!regexPattern.userIDRegex.test(userID)) throw new Error("id형식이 맞지않음");
        if (!regexPattern.userPwRegex.test(userPw)) throw new Error("비번 형식맞지않음");
        if (!regexPattern.userNameRegex.test(userName)) throw new Error("이름 글자제한 2~5글자");
        if (!regexPattern.userPhonenumberRegex.test(userPhonenumber)) throw new Error("전화번호 형식제한 숫자 10~12글자");
        if (!regexPattern.userBirthRegex.test(userBirth)) throw new Error("생일형식 불일치")
        if (userPw != userPwCheck) throw new Error("비밀번호확인 불일치");

        const sql = `INSERT INTO account(id, pw, name, phonenumber,birth) VALUES (?,?,?,?,?)`;
        const values = [userID, userPw, userName, userPhonenumber, userBirth];
        const conn = mysql.createConnection(dbconfig);  // db연결 api내에서

        conn.query(sql, values, (err) => {
            try {
                if (err) throw new Error(err);
                result.success = true;
                result.message = "회원가입성공";
            } catch (e) {
                result.message = e.message;
            } finally {
                res.send(result);
                conn.end();
            }
        });

    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})

// 로그인 api
router.get("/login", (req, res) => {
    const { userID, userPw } = req.body;
    const result = {
        "success": false,
        "message": "로그인실패"
    };

    try {

        //if문 한줄로 줄이기
        if (!userID?.trim() || !userPw?.trim()) throw new Error("빈값이 존재해요")
        if (!regexPattern.userIDRegex.test(userID)) throw new Error("아이디 글자제한")
        if (!regexPattern.userPwRegex.test(userPw)) throw new Error("비번 글자제한");

        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT * FROM account WHERE id = ? AND pw = ?";
        const values = [userID, userPw];

        //query메소드의 3번째인자의 함수는 콜백함수로, 비동기적으로 동작하는 함수이다
        //그래서 query문의 뒷부분까지 미리 실행되고나서, 콜백함수 실행된다.
        //함수구조를 바꾸어 동기적으로 작동하게끔 만들어준다.
        conn.query(sql, values, (err, rs) => { // 반환되는 result는 배열이다.
            try {
                if (err) throw new Error(err);
                if (result.length == 0) throw new Error("로그인정보없음");

                console.log(result);
                req.session.idx = rs[0].idx;
                req.session.name = rs[0].name;
                req.session.phonenumber = rs[0].phonenumber;
                req.session.birth = rs[0].birth;
                result.success = "true";
                result.message = "로그인성공";

            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})

//로그아웃
router.delete("/logout", (req, res) => {
    const result = {
        "success": false,
        "message": "로그아웃실패"
    }
    try {
        req.session.destroy;
        result.success = true;
        result.message = "로그아웃성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

//id중복찾기
router.get("/idCheck", (req, res) => {
    const userID = req.body.userID;
    const result = {
        "success": false,
        "message": "id중복",
        "data":
            { isDuplicated: false }
    }

    try {
        if (!userID?.trim()) throw new Error("빈값이 존재해요");
        if (!regexPattern.userIDRegex.test(userID)) throw new Error("아이디 글자제한");

        const conn = mysql.createConnection(dbconfig);
        const query = `SELECT idx FROM account WHERE id = ?`;
        const values = [userID];

        conn.query(sql, values, (err, rs) => { // 3번째인자 : 콜백함수 : <err:에러객체>, <result:결과 배열>,<fields:쿼리 결과에 대한 필드 정보, 보통안씀>

            try {
                if (err) throw new Error(err);
                if (rs.length > 0) {
                    result.data.isDuplicated = true;
                    throw new Error("중복된 id");
                }
                result.success = true;
                result.message = "사용가능한 id";
                result.data.isDuplicated = false;

            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result); //쿼리문안에서 에러난경우
            }
        });
    } catch (e) {
        result.message = e.message;
        res.send(result); //쿼리문밖에서 에러난경우
    }
})

//id찾기
router.get("/id", (req, res) => {
    const { userName, userPhonenumber } = req.body;
    const result = {
        "success": false,
        "message": "id찾기실패",
        "id": ""      //id도 반환해줘야함
    }

    try {
        if (!userName?.trim() || !userPhonenumber?.trim()) throw new Error("빈값이 존재해요");
        if (!regexPattern.userNameRegex.test(userName)) throw new Error("이름 글자제한 2~5글자");
        if (!regexPattern.userPhonenumberRegex.test(userPhonenumber)) throw new Error("전화번호 형식제한 숫자 10~12글자");

        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT id FROM account WHERE name = ? AND phonenumber = ?";
        const values = [userName, userPhonenumber];

        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error(err);
                if(result.length == 0) throw new Error("일치하는 id없음")
                result.success = true;
                result.message = "id찾기 성공";
                result.id = rs[0].id;
            } catch (e) {
                result.message = e.message;
            } finally {
                conn.end();
                res.send(result)
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result)
    }
})
//비밀번호찾기
router.get("/pw", (req, res) => {
    //예외처리
    const { userID, userName, userPhonenumber } = req.body;
    const result = {
        "success": false,
        "message": "pw찾기실패",
        "pw": ""
    }

    try {
        if (!userID?.trim() || !userName?.trim() || !userPhonenumber?.trim()) throw new Error("빈값이 존재해요")
        if (!regexPattern.userIDRegex.test(userID)) throw new Error("id형식이 맞지않음")
        if (!regexPattern.userNameRegex.test(userName)) throw new Error("이름 글자제한 2~5글자");
        if (!regexPattern.userPhonenumberRegex.test(userPhonenumber)) throw new Error("전화번호 형식제한 숫자 10~12글자");

        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT pw FROM account WHERE id = ? AND name = ? AND phonenumber = ?";
        const values = [userID, userName, userPhonenumber];

        conn.query(sql, values, (err, rs) => {
            try{
                if (err) throw new Error(err);
                if(rs.length ==0 ) throw new Error("일치하는 pw없음")
                result.success = true;
                result.message = "pw찾기 성공";
                result.pw = rs[0].pw;
            }catch (e) {
                result.message = e.message;
            } finally{
                res.send(result);
                conn.end();
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})
//내정보보기
router.get("/info/:idx", (req, res) => {
    const  idx = req.params.idx;
    //idx는 세션으로 받아오기 , body x
    //idx 유무 체크
    const result = {
        "success": false,
        "message": "실패",
        "data": {
            "name": "",
            "phonenumber": "",
            "birth": "",
            "signupDate": "",
            "profile": ""
        }
    }
    try {
        if (req.session.idx != idx) throw new Error("사용자idx 불일치")
        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT * FROM account WHERE idx = ?";
        const values = [idx];
        conn.query(sql, values, (err, rs) => { //반환되는 result는 배열
            try{
                if (err) throw new Error(err);
                if(rs.length ==0 ) throw new Error("일치하는 회원정보없음")
                console.log(rs)
                result.success = true;
                result.message = "내정보 조회 성공";
                result.data.name = rs[0].name;
                result.data.phonenumber = rs[0].phonenumber;
                result.data.birth = rs[0].birth;
                result.data.signupDate = rs[0].signupDate;
                result.data.profile = rs[0].profile;
            }catch (e) {
                result.message = e.message;
            } finally{
                res.send(result);
                conn.end();
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})

//정보수정
router.put("/:idx", (req, res) => {
    const { userName, userPhonenumber, birth, profile } = req.body;
    const idx = req.params.idx;
    const result = {
        "success": false,
        "message": "수정실패",
        "data": {
            "name": "",
            "phonenumber": "",
            "birth": "",
            "profile": ""
        }
    }

    try {

        if (req.session.idx != idx) throw new Error("사용자idx 불일치")
        const conn = mysql.createConnection(dbconfig);
        const sql = "UPDATE account SET name = ?, phonenumber = ?, birth = ?, profile = ? WHERE idx = ?";
        const values = [userName, userPhonenumber, birth, profile, idx];

        conn.query(sql, values, (err, rs) => {
            try{
                if (err) throw new Error(err);
                if(rs.length == 0 ) throw new Error("일치하는 회원정보없음")
                console.log(rs)
                result.success = true;
                result.message = "내정보 조회 성공";
                result.data.name = userName;
                result.data.phonenumber = userPhonenumber;
                result.data.birth = birth;
                result.data.profile = profile;
            }catch (e) {
                result.message = e.message;
            } finally{
                res.send(result);
                conn.end();
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})

//회원탈퇴
router.delete("/:idx", (req, res) => {
    const idx = req.params.idx;
    const result = {
        "success": false,
        "message": "실패",
    };

    try {

        if (req.session.idx != idx) throw new Error("사용자idx 불일치")

        const conn = mysql.createConnection(dbconfig);
        const sql = "DELETE FROM account WHERE idx = ?";
        const values = [idx];

        conn.query(sql, values, (err) => {

            try{
                if (err) throw new Error(err);
                result.success = true;
                result.message = "회원탈퇴 성공";
            }catch (e) {
                result.message = e.message;
            } finally{
                res.send(result);
                conn.end();
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})
   
module.exports = router;



