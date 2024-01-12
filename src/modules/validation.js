const { body, param, query, validationResult } = require("express-validator");

const sessionCheck = (req, res, next) => {
    if (!req.session.userIdx) res.status(401).send({ message: "인증되지않은사람" });
    else next();
}

const validate = validations => {
    return async (req, res, next) => {
        // validations.forEach((elem) => {
        //     const result = await elem.run(req)
        //     if(result.errors.length) break;
        // })

        for (let validation of validations) {
            const result = await validation.run(req)
            if (result.errors.length) break;

        }

        //체이닝된 조건식들을 비동기처리하여 run(req) 해준뒤, 그결과를 변수값에 validationResult(req)로 받아준다


        const errors = validationResult(req);
        if (!errors.isEmpty()) res.status(400).send();
        else next()
    }
}


const userIDCheck = (req, res, next) => {

    const { userID } = req.body;
    const userIDregex = /^[a-zA-Z][a-zA-Z0-9]{0,19}$/

    try {
        if (userID == "" || userID == null) throw new Error("id빈값")
        if (!userID.match(userIDregex)) throw new Error("id형식불일치")
        next()
    }
    catch (e) {
        next(e)
    }
}

const userPwCheck = (req, res, next) => {

    const { userPw } = req.body;
    const userPwregex = /(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-])/

    try {
        if (userPw == "" || userPw == null) throw new Error("pw빈값")
        if (!userPw.match(userPwregex)) throw new Error("pw형식불일치")
        next()
    } catch (e) {
        next(e)
    }
}

const userPwCheckCheck = (req, res, next) => {

    const { userPw, userPwCheck } = req.body;

    try {
        if (userPw !== userPwCheck) throw new Error("pwCheck 불일치")
        next();
    } catch (e) {
        next(e)
    }
}

const userNameCheck = (req, res, next) => {

    try {
        const { userName } = req.body;
        const userNameregex = /^[a-zA-Z가-힣]{1,5}$/

        if (userName == "" || userName == null) throw new Error("name 빈값")
        if (!userName.match(userNameregex)) throw new Error("name 형식불일치")
        next()
    } catch (e) {
        next(e);
    }
}

const userPhonenumberCheck = (req, res, next) => {

    try {

        // body("userPhonenumber").trim().replace('/^[^0-9]$/', "").isLength({ min: 10, max: 12 }, "전화번호 글자수 제한")

        // const error = validationResult(req);
        // if (!error.isEmpty()) res.status(400).send({ message: error.array() });

        // else next();

        let { userPhonenumber } = req.body;
        const userPhonenumberregex = /^[0-9]{10,12}$/

        userPhonenumber = userPhonenumber.trim().replace(/[^0-9]/g,"");
        req.body.userPhonenumber = userPhonenumber

        if (userPhonenumber == "" || userPhonenumber == null) throw new Error("전화번호 빈값")
        if (!userPhonenumber.match(userPhonenumberregex)) throw new Error("전화번호 형식불일치")
        next()

    } catch (e) {
        next(e);
    }
}

const userBirthCheck = async (req, res, next) => {

    try {
        // const result = await body("userBirth").trim().notEmpty().isLength({min:5}).run(req);
        // const error = validationResult(req);

        // if (!error.isEmpty()) res.status(400).send({ message: error.array() });

        // else next();

        let { userBirth } = req.body;
        const userBirthregex = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/

        userBirth = userBirth.trim();

        if (userBirth == "" || userBirth == null) throw new Error("생일 빈값");
        if (!userBirth.match(userBirthregex)) throw new Error("생일 형식불일치");
        next()

    } catch (e) {
        next(e)
    }
}

const titleCheck = (req, res, next) => {

    const { title } = req.body

    try {
        if (title == "" || title == null) throw new Error("제목빈값")
        next();
    } catch (e) {
        next(e);
    }
}

const contentCheck = (req, res, next) => {

    const { content } = req.body

    try {
        if (content == "" || content == null) throw new Error("내용빈값")
        next();
    } catch (e) {
        next(e);
    }
}

const articleidxCheck = (req, res, next) => {

    let numCount = 0;

    const articleBody = req.body.articleidx;
    const articleParam = req.params.articleidx;
    const articleQuery = req.query.articleidx;

    if (articleBody == "" || articleBody == null) numCount++
    if (articleParam == "" || articleParam == null) numCount++
    if (articleQuery == "" || articleQuery == null) numCount++

    try {
        if (numCount == 3) throw new Error("airticleidx null");
        next();
    } catch (e) {
        next(e);
    }
}


const commentidxCheck = (req, res, next) => {
    let numCount = 0;

    const commentBody = req.body.commentidx;
    const commentParam = req.params.commentidx;
    const commentQuery = req.query.commentidx;

    if (commentBody == "" || commentBody == null) numCount++
    if (commentParam == "" || commentParam == null) numCount++
    if (commentQuery == "" || commentQuery == null) numCount++

    try {
        if (numCount == 3) throw new Error("commentidx null");
        next();
    } catch (e) {
        next();
    }
}

const nullCheck = (tmp) => {
    if (!tmp.isEmpty()) res.status(400).send({ message: error.array() });

    else next();
}


module.exports = {
    validate,
    sessionCheck,
    userIDCheck,
    userPwCheck,
    userPwCheckCheck,
    userNameCheck,
    userPhonenumberCheck,
    userBirthCheck,
    titleCheck,
    contentCheck,
    articleidxCheck,
    commentidxCheck,
    nullCheck
}