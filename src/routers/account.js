
const router = require("express").Router();
const pattern = require("../modules/pattern.js");
const mysql = require('mysql');

//postgreSQL 연결
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');
const pool = new Pool(dbconfig);

// 회원가입 api
//여기서도중복체크해야댐
router.post('/', (req, res) => {
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

        const sql = `INSERT INTO class.account(id, pw, name, phonenumber, birth) VALUES ($1, $2, $3, $4, $5)`;
        const values = [userID, userPw, userName, userPhonenumber, userBirth];
        
        pool.connect();
        pool.query(sql, values, (err) => {
            try {
                if (err) throw new Error(err);
                result.success = true;
            } catch (e) {
                result.message = e.message;
            } finally {
                res.send(result);
            }
        })
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
        "message": ""
    };

    try {
        //if문 한줄로 줄이기
        if (!userID?.trim() || !userPw?.trim()) throw new Error("빈값이 존재해요")

        pattern.userIDCheck(userID);
        pattern.userPwCheck(userPw);

        const sql = "SELECT * FROM class.account WHERE id = $1 AND pw = $2";
        const values = [userID, userPw];
        //query메소드의 3번째인자의 함수는 콜백함수로, 비동기적으로 동작하는 함수이다
        //그래서 query문의 뒷부분까지 미리 실행되고나서, 콜백함수 실행된다.
        //함수구조를 바꾸어 동기적으로 작동하게끔 만들어준다.

        pool.connect();
        pool.query(sql, values, (err) => {
            try {
                if (err) throw new Error(err);
                result.success = true;
            } catch (e) {
                result.message = e.message;
            } finally {
                res.send(result);
            }
        });

    } catch (e) {
        result.message = e.message;
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
        req.session.destroy;
        result.success = true;
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
            { "isDuplicated" : false } // ""붙이나 안붙이나 상관없지만 붙이자
    }

    try {
        if (!userID?.trim()) throw new Error("빈값이 존재해요");
        pattern.userIDCheck(userID);


        const sql = `SELECT idx FROM account WHERE id = ?`;
        const values = [userID];


        client.connect();
        client.query(sql, values, (err) => {
            try {
                if (err) throw new Error(err);
                result.success = true;
            } catch (e) {
                result.message = e.message;
            } finally {
                res.send(result);
                conn.end();
            }
        });




        // const conn = mysql.createConnection(dbconfig);
        // conn.query(sql, values, (err, rs) => {
        //     try {
        //         if (err) throw new Error(err);
        //         if (rs.length > 0) {
        //             result.data.isDuplicated = true;
        //             throw new Error("중복된 id");
        //         }
        //         result.success = true;
        //         result.message = "사용가능한 id";
        //         result.data.isDuplicated = false;
        //     } catch (e) {
        //         result.message = e.message;
        //     } finally {
        //         conn.end();
        //         res.send(result); 
        //     }
        // });
    } catch (e) {
        result.message = e.message;
        res.send(result);
    }
})
//id찾기
router.get("/id", (req, res) => {
    const { userName, userPhonenumber } = req.body;
    const result = {
        "success": false,
        "message": "",
        "data":
        {    "id": ""     }
        
    }
    try {
        if (!userName?.trim() || !userPhonenumber?.trim()) throw new Error("빈값이 존재해요");

        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);

        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT id FROM account WHERE name = ? AND phonenumber = ?";
        const values = [userName, userPhonenumber];

        conn.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error(err);
                if(result.length == 0) throw new Error("일치하는 id없음")
                result.success = true;
                result.data.id = rs[0].id;
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
        "message": "",
        "data":
        {    "pw": ""     }
    }
    try {
        if (!userID?.trim() || !userName?.trim() || !userPhonenumber?.trim()) throw new Error("빈값이 존재해요")

        pattern.userIDCheck(userID);
        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);

        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT pw FROM account WHERE id = ? AND name = ? AND phonenumber = ?";
        const values = [userID, userName, userPhonenumber];
        conn.query(sql, values, (err, rs) => {
            try{
                if (err) throw new Error(err);
                if(rs.length ==0 ) throw new Error("일치하는 pw없음")
                result.success = true;
                result.data.pw = rs[0].pw;
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
    const idx = req.params.idx;
    //idx는 세션으로 받아오기 , body x
    //idx 유무 체크
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
        // if (req.session.idx != idx) throw new Error("사용자idx 불일치")
        const conn = mysql.createConnection(dbconfig);
        const sql = "SELECT * FROM account WHERE idx = ?";
        const values = [idx];
        conn.query(sql, values, (err, rs) => { //반환되는 result는 배열
            try{
                if (err) throw new Error(err);
                if(rs.length ==0 ) throw new Error("일치하는 회원정보없음")
                result.success = true;
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
        "message": "",
        "data": {
            "name": "",
            "phonenumber": "",
            "birth": "",
            "profile": ""
        }
    }
    try {
        // if (req.session.idx != idx) throw new Error("사용자idx 불일치")
        const conn = mysql.createConnection(dbconfig);
        const sql = "UPDATE account SET name = ?, phonenumber = ?, birth = ?, profile = ? WHERE idx = ?";
        const values = [userName, userPhonenumber, birth, profile, idx];

        conn.query(sql, values, (err, rs) => {
            try{
                if (err) throw new Error(err);
                if(rs.length == 0 ) throw new Error("일치하는 회원정보없음")
                console.log(rs)
                result.success = true;
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
        "message": "",
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



