const { body, validationResult } = require("express-validator");

const sessionCheck = (req, res, next) => {
    console.log(req)
    console.log(req.session);
    if (!req.session.idx) res.status(401).send({ message: "인증되지않은사람" });
    else next();
}

const userIDCheck = (req, res, next) => {

    body("userID").trim().isLength({ min: 1, max: 20 }).withMessage("글자수 제한");

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const userPwCheck = (req, res, next) => {

    body("userPw").trim().isLength({ min: 1, max: 20 }, "비번글자수제한").matches(/(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-])/).withMessage("비번형식제한")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const userPwCheckCheck = (req, res, next) => {

    body("userPwCheck").trim().custom((value, { req }) => {
        if (value != req.body.userPw) throw new Error("비밀번호 불일치");
        return true;
    })

    next();
}

const userNameCheck = (req, res, next) => {

    body("userName").trim().isLength({ min: 2, max: 5 }).matches(/^[a-zA-Z가-힣]+$/)

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const userPhonenumberCheck = (req, res, next) => {

    body("userPhonenumber").trim().replace('/^[^0-9]$/', "").isLength({ min: 10, max: 12 }, "전화번호 글자수 제한")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const userBirthCheck = (req, res, next) => {

    body("userBirth").trim().isDate();

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();

}

const titleCheck = (req, res, next) => {
    body("title").trim().isEmpty().withMessage("제목 빈값")

    const error = validationResult(req);

    console.log(error)
    console.log(error.array())

    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const contentCheck = (req, res, next) => {
    body("content").trim().isEmpty().withMessage("내용 빈값")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const articleidxBodyCheck = (req, res, next) => {
    body("articleidx").trim().isEmpty().withMessage("articleidx 빈값")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const articleidxQueryCheck = (req, res, next) => {
    body("articleidx").trim().isEmpty().withMessage("articleidx 빈값")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const articleidxParamCheck = (req, res, next) => {
    param("articleidx").trim().isEmpty().withMessage("articleidx 빈값")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const commentidxParamCheck = (req, res, next) => {
    param("commentidx").trim().isEmpty().withMessage("commentidx 빈값")

    const error = validationResult(req);
    if (!error.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}

const nullCheck = (tmp) => {
    if(!tmp.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}




module.exports = {
    sessionCheck,
    userIDCheck,
    userPwCheck,
    userPwCheckCheck,
    userNameCheck,
    userPhonenumberCheck,
    userBirthCheck,
    titleCheck,
    contentCheck,
    articleidxParamCheck,
    articleidxBodyCheck,
    commentidxParamCheck,
    nullCheck
}