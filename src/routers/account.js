
const router = require("express").Router();
const pattern = require("../modules/pattern.js");
const { Pool } = require("pg");
const dbconfig = require('../../config/db.js');

// 회원가입 api
//여기서도 아이디중복체크, 전화번호 중복체크 해야함.
// 비동기함수처리하기
// dbCP 옵션 설정하기
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

        const sql1 = `SELECT * FROM class.account WHERE id = $1`;
        const values1 = [userID];
        const pool = new Pool(dbconfig);

        pool.query(sql1, values1, (err, rs) => {
            try{
                if (err) throw new Error(err);
                if (rs.rows.length != 0) throw new Error("id중복")

                const sql = `INSERT INTO class.account(id, pw, name, phonenumber, birth) VALUES ($1, $2, $3, $4, $5)`;
                const values = [userID, userPw, userName, userPhonenumber, userBirth];

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
        const pool = new Pool(dbconfig);

        pool.query(sql, values, (err,rs) => { // pool.query에는 내부적으로 커넥션을 acquire, release하는 작업이 포함되어있다.
            try {
                if (err) throw new Error(err);
                if(!rs.rows || rs.rows.length==0) throw new Error("일치하는 회원정보없음") //undefined로 나올수도있고, 빈리스트 []로 나올 수 도있다? rs는 객체, rs.rows는 배열로 반환되기 때문이다

                const user = rs.rows[0]

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
        req.session.destroy();
        result.success = true;
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

//id중복체크
router.get("/idCheck", (req, res) => {
    const userID = req.body.userID;
    const result = {
        "success": false,
        "message": "id중복",
        "data":
            { "isDuplicated" : true } // ""붙이나 안붙이나 상관없지만 붙이자
    }

    try {
        if (!userID?.trim()) throw new Error("빈값이 존재해요");
        pattern.userIDCheck(userID);

        const sql = `SELECT idx FROM class.account WHERE id = $1`;
        const values = [userID];
        const pool = new Pool(dbconfig);

        pool.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error(err);
                if(rs.rows.length != 0 ) throw new Error("id 중복") 
                result.success = true;
                result.data.isDuplicated = false
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
//id찾기
router.get("/id", (req, res) => {
    const { userName, userPhonenumber } = req.body;
    const result = {
        "success": false,
        "message": "",
        "data":
            {"id": ""}
        
    }
    try {
        if (!userName?.trim() || !userPhonenumber?.trim()) throw new Error("빈값이 존재해요");

        pattern.userNameCheck(userName);
        pattern.userPhonenumberCheck(userPhonenumber);

        const sql = "SELECT id FROM class.account WHERE name = $1 AND phonenumber = $2";
        const values = [userName, userPhonenumber];
        const pool = new Pool(dbconfig);

        pool.query(sql, values, (err, rs) => {
            try {
                if (err) throw new Error(err);
                if(!rs.rows) throw new Error("일치하는 id없음")
                result.success = true;
                console.log(rs.rows[0].id)
                result.data.id = rs.rows[0].id.trim(); // id공백제거 
            } catch (e) {
                result.message = e.message;
            } finally {
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

        const sql = "SELECT pw FROM class.account WHERE id = $1 AND name = $2 AND phonenumber = $3";
        const values = [userID, userName, userPhonenumber];
        const pool = new Pool(dbconfig);

        pool.query(sql, values, (err, rs) => {
            try{
                if (err) throw new Error(err);
                if(!rs.rows) throw new Error("일치하는 pw없음")
                result.success = true;
                result.data.pw = rs.rows[0].pw.trim();
            }catch (e) {
                result.message = e.message;
            } finally{
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})
//내정보보기
router.get("/info", (req, res) => {
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

        pool.query(sql, values, (err, rs) => { //rs.rows는 배열, rs는 객체
            try{
                if (err) throw new Error(err);
                if(!rs.rows || rs.rows.length==0) throw new Error("일치하는 회원정보없음")

                const user = rs.rows[0] 

                result.success = true;
                result.data.name = user.name.trim();  //char타입에만 trim넣어줘야한다.
                result.data.phonenumber = user.phonenumber.trim();
                result.data.birth = user.birth;
                result.data.signupDate = user.signupDate;

                if(user.profile == null){
                    result.data.profile = "내용없음";
                } else{
                    result.data.profile = user.profile;
                }
                
            }catch (e) {
                result.message = e.message;
            } finally{
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})

//정보수정
router.put("/", (req, res) => {
    const { userName, userPhonenumber, birth, profile } = req.body;
    const idx = req.session.idx 
    const result = {
        "success": false,
        "message": ""
    }
    try {
        pattern.nullCheck(idx)

        const sql = "UPDATE class.account SET name = $1, phonenumber = $2, birth = $3, profile = $4 WHERE idx = $5";
        const values = [userName, userPhonenumber, birth, profile, idx];
        const pool = new Pool(dbconfig);

        pool.query(sql, values, (err, rs) => {
            try{
                if (err) throw new Error(err);
                if(!rs.rows) throw new Error("일치하는 회원정보없음")
                result.success = true;
            }catch (e) {
                result.message = e.message;
            } finally{
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})

//회원탈퇴
router.delete("/", (req, res) => {
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

        pool.query(sql, values, (err) => {
            try{
                if (err) throw new Error(err);
                result.success = true;
            }catch (e) {
                result.message = e.message;
            } finally{
                req.session.destroy();    
                res.send(result);
            }
        })
    } catch (e) {
        result.message = e.message;
        res.send(result);
    } 
})
   
module.exports = router;



