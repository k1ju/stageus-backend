const router = require("express").Router();
const session = require("express-session");
require('dotenv').config();
const secretCode = process.env;

router.use(session({
    resave:false,
    saveUninitialized:false,
    secret: secretCode
}));

//게시글 목록 불러오기route
router.get("/all", (req, res) => {
    const result = {
        "success": false,
        "message": "실패"
    }
    try {

        //db통신

        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//게시글 작성하기
router.post("/:userIdx", (req, res) => {
    const { title, content } = req.query;
    const userIdx = req.params.userIdx;
    const result = {
        "success": false,
        "message": "실패"
    }

    try {
        if (!req.session.idx) { // 세션이 널값이라면
            throw new Error("세션없음")
        };
        //db통신

        result.success = true;
        result.message = "성공";

    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//게시글 수정하기
router.put("/", (req, res) => {
    const { title, content } = req.query;
    const { userIdx, articleIdx } = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }
    try {

        if (!req.session.idx) { // 세션이 널값이라면
            throw new Error("세션없음");
        };
        if (req.session.idx !== userIdx) {
            throw new Error("사용자 idx가 불일치");
        };
        //db통신

        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//게시글 삭제하기
router.delete("/:userIdx/:articleIdx", (req, res) => {
    const { userIdx, articleIdx } = req.params;
    //idx 패스파라미터
    const result = {
        "success": false,
        "message": "실패"
    }

    try {

        if (!req.session.idx) { // 세션이 널값이라면
            throw new Error("세션없음")
        };
        if (req.session.idx !== userIdx) {
            throw new Error("사용자 idx가 불일치")
        }

        //db통신


        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})
//게시글 자세히보기
router.get("/", (req, res) => {
    const { articleIdx, title, content } = req.query;
    const result = {
        "success": false,
        "message": "실패"
    }


    try {

        //db통신

        result.success = true;
        result.message = "성공";
    } catch (e) {
        result.message = e.message;
    } finally {
        res.send(result);
    }
})

module.exports = router;