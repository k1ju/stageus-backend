const router = require("express").Router();

//게시글 목록 불러오기route
// /article 2개
router.get("/", (req, res) => {
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//게시글 작성하기
router.post("/", (req, res) => {
    const { userIdx, title, content } = req.query;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);

})
//게시글 수정하기
router.put("/", (req, res) => {
    const { articleIdx, title, content } = req.query;
//

    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//게시글 삭제하기
router.delete("/", (req, res) => {
    const idx = req.query.idx;
    //idx 패스파라미터
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//게시글 자세히보기
router.get("/", (req, res) => {
    const {articleIdx, title, content } = req.query;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})


module.exports = router;