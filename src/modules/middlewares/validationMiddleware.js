
const { body, validationResult } = require("express-validator");
const { userBirthCheck } = require("../pattern");


body("userID").trim().isLength({ min: 1, max: 20 }).withMessage("글자수 제한")
body("userPw").trim().isLength({ min: 1, max: 20 }, "비번글자수제한").matches(/(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-])/).withMessage("비번형식제한")
    body("userPwCheck").trim().custom((value, { req }) => {
        if( value != req.body.userPw) throw new Error("비밀번호 불일치");
        return true;
    })
    body("userName").trim().isLength({ min: 2, max: 5 }).matches(/^[a-zA-Z가-힣]+$/)
    body("userPhonenumber").trim().replace('/^[^0-9]$/', "").isLength({ min: 10, max: 12 }, "전화번호 글자수 제한")
    body("userBirth").trim().isDate()



const sessionCheck = (req, res, next) => {
    if(!req.session.idx) res.status(401).send({message : "인증되지않은사람"});
    next();
}

const userIDCheck = (req, res, next) => {

    body("userID").trim().isLength({ min: 1, max: 20 }).withMessage("글자수 제한")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    next();
}

const userPwCheck = (req, res, next) => {

    body("userPw").trim().isLength({ min: 1, max: 20 }, "비번글자수제한").matches(/(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-])/).withMessage("비번형식제한")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    next();
}

const userPwCheckCheck = (req, res, next) => {

    body("userPwCheck").trim().custom((value, { req }) => {
        if( value != req.body.userPw) throw new Error("비밀번호 불일치");
        return true;
    })

    next();
}

const userNameCheck = (req, res, next) => {

    body("userName").trim().isLength({ min: 2, max: 5 }).matches(/^[a-zA-Z가-힣]+$/)

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    next();
}

const userPhonenumberCheck = (req, res, next) => {

    body("userPhonenumber").trim().replace('/^[^0-9]$/', "").isLength({ min: 10, max: 12 }, "전화번호 글자수 제한")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    next();
}

const userBirthCheck = (req, res, next) => {
    
    body("userBirth").trim().isDate();

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    next();

}



// app.use('/', (req, res, next) => {
//     const { userID, userPw, userPwCheck, userName, userPhonenumber, userBirth } = req.body;


//     validationResult.check(userID, "UserID")
//         .trim()
//         .notEmpty("빈값존재")
//         .isLength({ min: 1, max: 20 }, "아이디글자수제한")

//     validationResult.check(userPw, "UserPw")
//         .trim()
//         .notEmpty("빈값존재")
//         .isLength({ min: 1, max: 20 }, "비번글자수제한")
//         .matches(/^(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-])$/, "특수문자,숫자,문자 모두포함")

//     validationResult.check(userPwCheck, "UserPwCheck")
//         .isEqual(userPw, "비밀번호 확인과 일치하지 않습니다")

//     validationResult.check(userName, "UserName")
//         .trim()
//         .notEmpty("빈값존재")

//     validationResult.check(userPhonenumber, "userPhonenumber")
//         .trim()
//         .notEmpty("빈값존재")
//         .isPhoneNumber("전화번호형식오류")

//     validationResult.check(userBirth, "userBirth")
//         .notEmpty("빈값 존재")
//         .isDate("날짜형식오류")
// })

module.exports = {
    sessionCheck,
    userIDCheck,
    userPwCheck,
    userPwCheckCheck,
    userNameCheck,
    userPhonenumberCheck,
    userBirthCheck
    }