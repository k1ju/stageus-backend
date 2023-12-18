const router = require("express").Router();

//댓글쓰기
router.post("/:articleidx/:content/:useridx", (req, res) => {
    const { articleidx, content, useridx } = req.params
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//댓글 읽기
router.get("/:articleidx", (req, res) => {
    const articleidx = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }

    res.send(result.rows)
})
//댓글수정하기
router.put("/:commentidx/:content", (req, res) => {
    const { commentidx, content } = req.params;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})
//댓글삭제하기
router.delete("/:commentidx", (req, res) => {
    const commentidx = req.params.idx;
    const result = {
        "success": false,
        "message": "실패"
    }

    result.success = true;
    result.message = "성공";
    res.send(result);
})

module.exports = router;
