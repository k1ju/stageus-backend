const router = require("express").Router();

// 회원가입 api
router.post('/', (req, res) => {
    const { userID, userPw, userPwCheck, userName, userPhonenumber } = req.query;
//body이용하기
//json을 body로받는다
//쿼리스트링,패스파라미터 필요성: get,delete는 body로 못보냄 
    const result = {
        "success": false,
        "message": "회원가입실패"
    }

    userIDRegex = /^\w[\w\d!@#$%^&*()_+{}|:"<>?/-]{1,19}$/;
    userPwRegex = /^(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-]){1,20}$/;
    userNameRegex = /^[가-힣]{2,5}$/;
    userPhonenumberRegex = /^[0-9]{10,12}$/;

    try{

        if(userID?.trim()  )

        if (!userIDRegex.test(userID)) {
            result.message = "아이디 글자제한";
            res.send(result);
        }
        if (!userPwRegex.test(userPw)) {
            result.message = "비번 글자제한";
            res.send(result);
        }
        if (!userNameRegex.test(userName)) {
            result.message = "이름 글자제한 2~5글자";
            res.send(result);
        }
        if (!userPhonenumberRegex.test(userPhonenumber)) {
            result.message = "전화번호 형식제한 숫자 10~12글자";
            res.send(result);
        }
        if (userPw != userPwCheck) {
            result.message = "비밀번호확인 불일치";
            res.send(result);
        }
    
        result.success = true;
        result.message = "회원가입성공";
        res.send(result);
    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
    }
})

// 로그인 api
router.get("/login", (req, res) => {
    const { userID, userPw } = req.query;
    const result = {
        "success": false,
        "message": "로그인실패",
        "session": ""
    }
    if (!req.session.user) {
        req.session.user = {
            userIdx: "idx",
            userID: "id",
            userPw: "pw",
            username: "userName"
        }
    };
    if (results.length > 0) {
        result.success = true;
        result.message = "로그인성공";
        result.session = req.session.test
    }
    res.send(result);
})
//로그아웃
router.delete("/logout", (req, res) => {
    req.session.destroy;

})

//id중복찾기

const result = {
    "success": false,
    "message": "id찾기실패",
    "data" :
    {isDuplicated: false}
}

//id찾기
router.get("/id", (req, res) => {
    const { userName, userPhonenumber } = req.query;

    //id
    const result = {
        "success": false,
        "message": "id찾기실패",
        "id": ""
    }
    result.success = true;
    result.message = "id찾기성공";
    result.id = "id";
    res.send(result)
})
//비밀번호찾기
router.get("/pw", (req, res) => {
    //예외처리
    const { userName, userPhonenumber } = req.query;
    const result = {
        "success": false,
        "message": "pw찾기실패",
        "pw": ""
    }
    result.success = true;
    result.message = "pw찾기성공";
    result.pw = "pw";
    res.send(result)
})
//내정보보기

router.get("/info", (req, res) => {
    const { idx } = req.body;
    //idx는 세션으로 받아오기 , body x
    //idx 유무 체크
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//정보수정
router.put("/", (req, res) => {
    const { idx, userName, userPhonenumber, userPosition, userTeam } = req.query;
    const result = {
        "success": false,
        "message": "수정실패",
    }

    result.success = true;
    result.message = "변경성공";
    result.send(result);
})
//회원탈퇴
router.delete("/", (req, res) => {

    const idx = req.query.idx
    const result = {
        "success": false,
        "message": "탈퇴실패",
    }
    result.success = true;
    result.message = "탈퇴성공";
    res.send(result);

})


module.exports = router;